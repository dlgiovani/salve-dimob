import { DEFINICAO_DECLARACAO } from "../constantes";
import { criarNovoR02, criarNovoR03, criarNovoR04, gerarDeclaracao } from "../declaracao";
import type { iCampo, tDeclaracao } from "../types";
import { formatarValorParaDIMOB } from "../utils";
import { setDIMOBConfig } from "../config";

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

/**
 * Detects the sequential field format by analyzing line lengths.
 * The sequential field can be 5 or 7 digits, causing a 2-character offset
 * in all subsequent fields of R02, R03, and R04 records.
 *
 * @param conteudo - DIMOB file content
 * @returns 5 or 7 based on detected format
 */
export const detectSequentialFormat = (conteudo: string): 5 | 7 => {
    const lines = conteudo.split(/\r\n|\r|\n/);

    for (const line of lines) {
        if (!line || line.length < 3) continue;

        const tipo = line.substring(0, 3).trim();

        // Check R02, R03, or R04 line lengths (excluding EOL)
        // R02: 799 (5-digit) or 801 (7-digit)
        // R03: 249 (5-digit) or 251 (7-digit)
        // R04: 323 (5-digit) or 325 (7-digit)
        if (tipo === "R02") {
            return line.length >= 801 ? 7 : 5;
        } else if (tipo === "R03") {
            return line.length >= 251 ? 7 : 5;
        } else if (tipo === "R04") {
            return line.length >= 325 ? 7 : 5;
        }
    }

    // Default to 5-digit format if no R02/R03/R04 found
    return 5;
};

export const deserializarDIMOBParaDeclaracao = (conteudo: string): tDeclaracao => {
    const detectedFormat = detectSequentialFormat(conteudo);
    setDIMOBConfig({ tamanhoSequencial: detectedFormat });

    const declaracao = gerarDeclaracao();
    const linhas = conteudo.split(/\r\n|\r|\n/);

    for (const linha of linhas) {
        if (!linha || linha.length < 3) continue;

        const tipo = linha.substring(0, 3).trim();

        switch (tipo) {
            case "DIMOB":
                deserializarRegistro(linha, declaracao.Header, DEFINICAO_DECLARACAO.Header);
                break;
            case "R01":
                deserializarRegistro(linha, declaracao.R01, DEFINICAO_DECLARACAO.R01);
                break;
            case "R02": {
                const r02 = criarNovoR02();
                deserializarRegistro(linha, r02, DEFINICAO_DECLARACAO.R02);
                declaracao.R02.push(r02);
                break;
            }
            case "R03": {
                const r03 = criarNovoR03();
                deserializarRegistro(linha, r03, DEFINICAO_DECLARACAO.R03);
                declaracao.R03.push(r03);
                break;
            }
            case "R04": {
                const r04 = criarNovoR04();
                deserializarRegistro(linha, r04, DEFINICAO_DECLARACAO.R04);
                declaracao.R04.push(r04);
                break;
            }
            case "T09":
            case "T9":
                deserializarRegistro(linha, declaracao.T09, DEFINICAO_DECLARACAO.T09);
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
