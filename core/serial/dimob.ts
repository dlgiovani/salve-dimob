import { definicaoDeclaracao } from "../constantes";
import { criarNovoR02, criarNovoR03, criarNovoR04, gerarDeclaracao } from "../declaracao";
import type { iCampo, tDeclaracao } from "../types";
import { formatarValorParaDIMOB } from "../utils";

export const serializarDeclaracaoParaDIMOB = (declaracao: tDeclaracao): string => {
    let output = "";

    output += serializarRegistro(declaracao.Header);
    output += serializarRegistro(declaracao.R01);

    for (const r02 of declaracao.R02) {
        output += serializarRegistro(r02);
    }

    for (const r03 of declaracao.R03) {
        output += serializarRegistro(r03);
    }

    for (const r04 of declaracao.R04) {
        output += serializarRegistro(r04);
    }

    output += serializarRegistro(declaracao.T09);

    return output;
};

const serializarRegistro = (registro: Record<string, any>): string => {
    let linha = "";

    const campos = Object.values(registro);
    campos.sort((a, b) => parseInt(a.ordem) - parseInt(b.ordem));

    for (const campo of campos) {
        const valorFormatado = formatarValorParaDIMOB(
            campo.valor,
            campo.formato,
            campo.tamanho
        );
        linha += valorFormatado;
    }

    return linha;
};

export const deserializarDIMOBParaDeclaracao = (conteudo: string): tDeclaracao => {
    const declaracao = gerarDeclaracao();
    const linhas = conteudo.split(/\r\n|\r|\n/);

    for (const linha of linhas) {
        if (!linha || linha.length < 3) continue;

        const tipo = linha.substring(0, 3).trim();

        switch (tipo) {
            case "DIMOB":
                deserializarRegistro(linha, declaracao.Header, definicaoDeclaracao.Header);
                break;
            case "R01":
                deserializarRegistro(linha, declaracao.R01, definicaoDeclaracao.R01);
                break;
            case "R02": {
                const r02 = criarNovoR02();
                deserializarRegistro(linha, r02, definicaoDeclaracao.R02);
                declaracao.R02.push(r02);
                break;
            }
            case "R03": {
                const r03 = criarNovoR03();
                deserializarRegistro(linha, r03, definicaoDeclaracao.R03);
                declaracao.R03.push(r03);
                break;
            }
            case "R04": {
                const r04 = criarNovoR04();
                deserializarRegistro(linha, r04, definicaoDeclaracao.R04);
                declaracao.R04.push(r04);
                break;
            }
            case "T09":
            case "T9":
                deserializarRegistro(linha, declaracao.T09, definicaoDeclaracao.T09);
                break;
        }
    }

    return declaracao;
};

const deserializarRegistro = (linha: string, registro: any, definicao: any) => {
    for (const chave in definicao) {
        const campo = definicao[chave] as iCampo;
        const valor = linha.substring(campo.inicio - 1, campo.fim).trim();
        registro[chave] = {
            ...campo,
            valor
        };
    }
};
