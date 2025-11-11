import ExcelJS from 'exceljs';
import { definicaoDeclaracao, secoesDeclaracao } from '../constants';
import type { iCampo, tDeclaracaoDefinicao } from '../types';

const gerarCabecalhoPlanilha = (pasta: ExcelJS.Worksheet, nome: keyof tDeclaracaoDefinicao) => {

    const corpo = definicaoDeclaracao[nome] as any;
    const chaves = Object.keys(definicaoDeclaracao[nome]);

    let ordem = 1;
    let colunaCelula = 1;
    for (const chave of chaves) {
        const campo = corpo[chave] as iCampo;
        if (Number(campo.ordem) !== ordem) throw new Error(`Erro de ordem no campo ${nome}.${chave}`);

        if (["X", "N", "CPF", "CNPJ", "CPF/CNPJ", "CPF/CNPJ2", "ANO", "R$", "DATA", "X-UF", "N-MUN",]
            .includes(campo.formato) && !campo.valor) {
            const linha = pasta.getRow(1);
            const celula = linha.getCell(colunaCelula);
            celula.value = campo.campo // nome legível
            colunaCelula++;
        };

        ordem++;
    };
};

export const gerarPastaDeTrabalho = () => {

    const pasta = new ExcelJS.Workbook();
    pasta.creator = "SALVE-DIMOB por dlgiovani.dev";
    pasta.lastModifiedBy = "SALVE-DIMOB por dlgiovani.dev";

    for (const k of Object.keys(secoesDeclaracao) as [keyof typeof secoesDeclaracao]) {
        const planilha = pasta.addWorksheet(`${k} - ${secoesDeclaracao[k]}`);
        gerarCabecalhoPlanilha(planilha, k);
    };

    pasta.xlsx.writeFile("./teste.xlsx");


};