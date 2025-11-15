import ExcelJS from "exceljs";
import { DEFINICAO_DECLARACAO, SECOES_DECLARACAO } from "../constantes";
import {
  criarNovoR01,
  criarNovoR02,
  criarNovoR03,
  criarNovoR04,
} from "../declaracao";
import type { iCampo, tDeclaracao, tDeclaracaoDefinicao } from "../types";
import {
  buscarChavePorCampoDesc,
  formatarValorDeExcel,
  formatarValorParaExcel,
} from "../utils";

const gerarCabecalhoPlanilha = (
  caderno: ExcelJS.Worksheet,
  nome: keyof tDeclaracaoDefinicao,
) => {
  const corpo = DEFINICAO_DECLARACAO[nome] as any;
  const chaves = Object.keys(DEFINICAO_DECLARACAO[nome]);

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
      const linha = caderno.getRow(1);
      const celula = linha.getCell(colunaCelula);
      celula.value = campo.campo;

      const coluna = caderno.getColumn(colunaCelula);

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

export const gerarCaderno = () => {
  const caderno = new ExcelJS.Workbook();
  caderno.creator = "SALVE-DIMOB por dlgiovani.dev";
  caderno.lastModifiedBy = "SALVE-DIMOB por dlgiovani.dev";

  for (const chaveSecao of Object.keys(
    SECOES_DECLARACAO,
  ) as (keyof typeof SECOES_DECLARACAO)[]) {
    const planilha = caderno.addWorksheet(`${chaveSecao} - ${SECOES_DECLARACAO[chaveSecao]}`);
    gerarCabecalhoPlanilha(planilha, chaveSecao);
  }

  return caderno;
};

export const copiarDeclaracaoParaCaderno = (
  declaracao: tDeclaracao,
): ExcelJS.Workbook => {
  const caderno = gerarCaderno();

  for (const chaveSecao of Object.keys(
    SECOES_DECLARACAO,
  ) as (keyof typeof SECOES_DECLARACAO)[]) {
    const planilha = caderno.getWorksheet(`${chaveSecao} - ${SECOES_DECLARACAO[chaveSecao]}`);
    if (!planilha) continue;

    const corpo = DEFINICAO_DECLARACAO[chaveSecao] as any;
    const chaves = Object.keys(DEFINICAO_DECLARACAO[chaveSecao]);

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

    if (chaveSecao === "R02" || chaveSecao === "R03" || chaveSecao === "R04") {
      const registros = declaracao[chaveSecao] as any[];
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
      const registro = declaracao[chaveSecao] as any;
      const linha = planilha.getRow(2);
      cabecalhoMap.forEach((chave, indiceColuna) => {
        const celula = linha.getCell(indiceColuna + 1);
        const campo = corpo[chave] as iCampo;
        const valorDIMOB = registro[chave]?.valor || "";
        celula.value = formatarValorParaExcel(valorDIMOB, campo.formato);
      });
    }
  }

  return caderno;
};

export const copiarDadosDeCadernoParaDeclaracao = (
  caderno: ExcelJS.Workbook,
  declaracao: tDeclaracao,
) => {
  caderno.eachSheet((planilha, idPlanilha) => {
    const linhas = planilha.getSheetValues();
    if (!linhas || linhas.length < 2) return;

    const cabecalho = linhas[1];
    if (!cabecalho || !Array.isArray(cabecalho)) return;

    const secaoChave = planilha.name.slice(0, 3) as keyof tDeclaracaoDefinicao;

    linhas
      .slice(2)
      .filter((linha) => linha !== undefined)
      .forEach((linha: ExcelJS.RowValues) => {
        if (!Array.isArray(linha)) return;

        const registro: any =
          secaoChave === "R01"
            ? criarNovoR01()
            : secaoChave === "R02"
              ? criarNovoR02()
              : secaoChave === "R03"
                ? criarNovoR03()
                : secaoChave === "R04"
                  ? criarNovoR04()
                  : {};

        cabecalho.forEach((campoDesc, indice) => {
          const chaveFinal = buscarChavePorCampoDesc(
            campoDesc as string,
            secaoChave,
          );
          const campoMeta = registro[chaveFinal];
          const valorCelula = linha[indice];

          const definicaoSecao = DEFINICAO_DECLARACAO[secaoChave] as any;
          const campo = definicaoSecao[chaveFinal] as iCampo;

          registro[chaveFinal] = {
            ...campoMeta,
            valor: formatarValorDeExcel(
              valorCelula,
              campo.formato,
              campo.tamanho,
            ),
          };
        });

        if (
          secaoChave === "R02" ||
          secaoChave === "R03" ||
          secaoChave === "R04"
        ) {
          declaracao[secaoChave].push(registro);
        } else {
          declaracao[secaoChave] = registro;
        }
      });
  });

  return declaracao;
};
