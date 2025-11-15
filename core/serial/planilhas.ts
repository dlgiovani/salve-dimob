import ExcelJS from "exceljs";
import { definicaoDeclaracao, secoesDeclaracao } from "../constantes";
import {
  criarNovoR01,
  criarNovoR02,
  criarNovoR03,
  criarNovoR04,
} from "../declaracao";
import type { iCampo, tDeclaracao, tDeclaracaoDefinicao } from "../types";
import {
  buscarChavePorCampoDesc,
  formatarValorParaExcel,
  formatarValorDeExcel,
} from "../utils";

const gerarCabecalhoPlanilha = (
  pasta: ExcelJS.Worksheet,
  nome: keyof tDeclaracaoDefinicao,
) => {
  const corpo = definicaoDeclaracao[nome] as any;
  const chaves = Object.keys(definicaoDeclaracao[nome]);

  let ordem = 1;
  let colunaCelula = 1;
  for (const chave of chaves) {
    const campo = corpo[chave] as iCampo;
    if (Number(campo.ordem) !== ordem)
      throw new Error(`Erro de ordem no campo ${nome}.${chave}`);

    if (
      [
        "X",
        "N",
        "CPF",
        "CNPJ",
        "CPF/CNPJ",
        "CPF/CNPJ2",
        "ANO",
        "R$",
        "DATA",
        "X-UF",
        "N-MUN",
        "N-SEQ",
      ].includes(campo.formato) &&
      !campo.valor
    ) {
      const linha = pasta.getRow(1);
      const celula = linha.getCell(colunaCelula);
      celula.value = campo.campo;

      const coluna = pasta.getColumn(colunaCelula);

      switch (campo.formato) {
        case "DATA":
          coluna.numFmt = "dd/mm/yyyy";
          coluna.width = 12;
          break;
        case "R$":
          coluna.numFmt = "#,##0.00";
          coluna.width = 15;
          break;
        case "CPF":
          coluna.numFmt = "@";
          coluna.width = 14;
          break;
        case "CNPJ":
          coluna.numFmt = "@";
          coluna.width = 18;
          break;
        case "CPF/CNPJ":
        case "CPF/CNPJ2":
          coluna.numFmt = "@";
          coluna.width = 18;
          break;
        case "N":
        case "ANO":
        case "N-SEQ":
          coluna.numFmt = "0";
          coluna.width = campo.tamanho + 2;
          break;
        default:
          coluna.width = Math.max(campo.tamanho, campo.campo.length) + 2;
      }

      if (campo.enum) {
        coluna.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          if (rowNumber > 1) {
            cell.dataValidation = {
              type: "list",
              allowBlank: false,
              formulae: [
                `"${campo.enum!.map((e) => `${e.valor} - ${e.descricao}`).join(",")}"`,
              ],
              showErrorMessage: true,
              errorTitle: "Valor Inválido",
              error: `Selecione um valor válido para ${campo.campo}`,
            };
          }
        });
      }

      colunaCelula++;
    }

    ordem++;
  }
};

export const gerarPastaDeTrabalho = () => {
  const pasta = new ExcelJS.Workbook();
  pasta.creator = "SALVE-DIMOB por dlgiovani.dev";
  pasta.lastModifiedBy = "SALVE-DIMOB por dlgiovani.dev";

  for (const k of Object.keys(
    secoesDeclaracao,
  ) as (keyof typeof secoesDeclaracao)[]) {
    const planilha = pasta.addWorksheet(`${k} - ${secoesDeclaracao[k]}`);
    gerarCabecalhoPlanilha(planilha, k);
  }

  return pasta;
};

export const copiarDeclaracaoParaCaderno = (
  declaracao: tDeclaracao,
): ExcelJS.Workbook => {
  const pasta = gerarPastaDeTrabalho();

  for (const k of Object.keys(
    secoesDeclaracao,
  ) as (keyof typeof secoesDeclaracao)[]) {
    const planilha = pasta.getWorksheet(`${k} - ${secoesDeclaracao[k]}`);
    if (!planilha) continue;

    const corpo = definicaoDeclaracao[k] as any;
    const chaves = Object.keys(definicaoDeclaracao[k]);

    let colunaCelula = 1;
    const cabecalhoMap: string[] = [];

    for (const chave of chaves) {
      const campo = corpo[chave] as iCampo;
      if (
        [
          "X",
          "N",
          "CPF",
          "CNPJ",
          "CPF/CNPJ",
          "CPF/CNPJ2",
          "ANO",
          "R$",
          "DATA",
          "X-UF",
          "N-MUN",
          "N-SEQ",
        ].includes(campo.formato) &&
        !campo.valor
      ) {
        cabecalhoMap.push(chave);
        colunaCelula++;
      }
    }

    if (k === "R02" || k === "R03" || k === "R04") {
      const registros = declaracao[k] as any[];
      registros.forEach((registro, indiceRegistro) => {
        const linha = planilha.getRow(indiceRegistro + 2);
        cabecalhoMap.forEach((chave, indiceColuna) => {
          const celula = linha.getCell(indiceColuna + 1);
          const campo = corpo[chave] as iCampo;
          const valorDIMOB = registro[chave]?.valor || "";
          celula.value = formatarValorParaExcel(valorDIMOB, campo.formato);
        });
      });
    } else {
      const registro = declaracao[k] as any;
      const linha = planilha.getRow(2);
      cabecalhoMap.forEach((chave, indiceColuna) => {
        const celula = linha.getCell(indiceColuna + 1);
        const campo = corpo[chave] as iCampo;
        const valorDIMOB = registro[chave]?.valor || "";
        celula.value = formatarValorParaExcel(valorDIMOB, campo.formato);
      });
    }
  }

  return pasta;
};

export const copiarDadosDeCadernoParaDeclaracao = (
  pasta: ExcelJS.Workbook,
  declaracao: tDeclaracao,
) => {
  pasta.eachSheet((planilha, idPlanilha) => {
    const linhas = planilha.getSheetValues();
    if (!linhas || linhas.length < 2) return;

    const cabecalho = linhas[1];
    if (!cabecalho || !Array.isArray(cabecalho)) return;

    const secao_chave = planilha.name.slice(0, 3) as keyof tDeclaracaoDefinicao;

    linhas
      .slice(2)
      .filter((linha) => linha !== undefined)
      .forEach((linha: ExcelJS.RowValues) => {
        if (!Array.isArray(linha)) return;

        const registro: any =
          secao_chave === "R01"
            ? criarNovoR01()
            : secao_chave === "R02"
              ? criarNovoR02()
              : secao_chave === "R03"
                ? criarNovoR03()
                : secao_chave === "R04"
                  ? criarNovoR04()
                  : {};

        cabecalho.forEach((campo_desc, indice) => {
          const chave_final = buscarChavePorCampoDesc(
            campo_desc as string,
            secao_chave,
          );
          const campo_meta = registro[chave_final];
          const valor_celula = linha[indice];

          const definicaoSecao = definicaoDeclaracao[secao_chave] as any;
          const campo = definicaoSecao[chave_final] as iCampo;

          registro[chave_final] = {
            ...campo_meta,
            valor: formatarValorDeExcel(
              valor_celula,
              campo.formato,
              campo.tamanho,
            ),
          };
        });

        if (
          secao_chave === "R02" ||
          secao_chave === "R03" ||
          secao_chave === "R04"
        ) {
          declaracao[secao_chave].push(registro);
        } else {
          declaracao[secao_chave] = registro;
        }
      });
  });

  return declaracao;
};
