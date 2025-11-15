import { definicaoDeclaracao, type FORMATOS } from "./constantes";
import type { iCampo, tDeclaracaoDefinicao } from "./types";

export const buscarChavePorCampoDesc = (
  campo_desc: string,
  secao_chave: keyof tDeclaracaoDefinicao,
) => {
  const secao = definicaoDeclaracao[secao_chave];

  let chave_encontrada: string = "";

  Object.entries(secao as Record<string, iCampo>).forEach(([chave, valor]) => {
    if (valor.campo === campo_desc) {
      if (chave_encontrada)
        throw new Error(
          `Chave duplicada ${campo_desc} na planilha ${secao_chave}`,
        );

      chave_encontrada = chave;
    }
  });

  if (chave_encontrada.length === 0)
    throw new Error(`Chave não encontrada: ${secao_chave}.${campo_desc}`);

  return chave_encontrada;
};

export const validarValorPorTipo = (
  valor: string,
  tipo: keyof typeof FORMATOS,
) => {};

export const formatarValorParaDIMOB = (
  valor: any,
  tipo: keyof typeof FORMATOS,
  tamanho: number,
): string => {
  if (!valor && valor !== 0)
    return "".padEnd(tamanho, tipo === "N" ? "0" : " ");

  switch (tipo) {
    case "EOL":
    case "BRANCO":
    case "ZERO":
      return valor;

    case "DATA":
      return formatarData(valor);

    case "R$":
      return formatarMoeda(valor, tamanho);

    case "CPF":
      return formatarCPF(valor);

    case "CNPJ":
      return formatarCNPJ(valor);

    case "CPF/CNPJ":
    case "CPF/CNPJ2":
      return formatarCPFouCNPJ(valor, tamanho);

    case "N":
    case "ANO":
    case "N-MUN":
    case "N-SEQ":
      return formatarNumero(valor, tamanho);

    case "X":
    case "X-UF":
    default:
      return formatarTexto(valor, tamanho);
  }
};

const formatarData = (valor: any): string => {
  if (typeof valor === "string" && /^\d{8}$/.test(valor)) {
    return valor;
  }

  let data: Date;

  if (valor instanceof Date) {
    data = valor;
  } else if (typeof valor === "string") {
    const partes = valor.replace(/[\/\-\.]/g, "/").split("/");
    if (partes.length === 3 && partes[0] && partes[1] && partes[2]) {
      const [dia, mes, ano] = partes;
      data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    } else {
      throw new Error(`Formato de data inválido: ${valor}`);
    }
  } else if (typeof valor === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    data = new Date(excelEpoch.getTime() + valor * 86400000);
  } else {
    throw new Error(`Tipo de data inválido: ${typeof valor}`);
  }

  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear().toString();

  return `${dia}${mes}${ano}`;
};

const formatarMoeda = (valor: any, tamanho: number): string => {
  if (typeof valor === "string" && /^\d+$/.test(valor)) {
    return valor.padStart(tamanho, "0");
  }

  const numero =
    typeof valor === "number"
      ? valor
      : parseFloat(
          valor
            .toString()
            .replace(/[^\d,.-]/g, "")
            .replace(",", "."),
        );

  if (isNaN(numero) || numero < 0) {
    throw new Error(`Valor monetário inválido: ${valor}`);
  }

  const centavos = Math.round(numero * 100);
  return centavos.toString().padStart(tamanho, "0");
};

const formatarCPF = (valor: any): string => {
  const digitos = valor.toString().replace(/\D/g, "");

  if (digitos.length !== 11) {
    throw new Error(`CPF deve ter 11 dígitos: ${valor}`);
  }

  return digitos;
};

const formatarCNPJ = (valor: any): string => {
  const digitos = valor.toString().replace(/\D/g, "");

  if (digitos.length !== 14) {
    throw new Error(`CNPJ deve ter 14 dígitos: ${valor}`);
  }

  return digitos;
};

const formatarCPFouCNPJ = (valor: any, tamanho: number): string => {
  const digitos = valor.toString().replace(/\D/g, "");

  if (digitos.length === 11) {
    return digitos.padEnd(tamanho, " ");
  } else if (digitos.length === 14) {
    return digitos;
  } else {
    throw new Error(`CPF/CNPJ deve ter 11 ou 14 dígitos: ${valor}`);
  }
};

const formatarNumero = (valor: any, tamanho: number): string => {
  const numero =
    typeof valor === "number"
      ? valor
      : parseInt(valor.toString().replace(/\D/g, ""));

  if (isNaN(numero)) {
    return "".padStart(tamanho, "0");
  }

  return numero.toString().padStart(tamanho, "0");
};

const formatarTexto = (valor: any, tamanho: number): string => {
  const texto = valor.toString().trim();
  return texto.substring(0, tamanho).padEnd(tamanho, " ");
};

export const formatarValorParaExcel = (
  valor: any,
  tipo: keyof typeof FORMATOS,
): any => {
  if (!valor && valor !== 0) return null;

  switch (tipo) {
    case "DATA":
      if (typeof valor === "string" && /^\d{8}$/.test(valor)) {
        const dia = valor.substring(0, 2);
        const mes = valor.substring(2, 4);
        const ano = valor.substring(4, 8);
        return `${dia}/${mes}/${ano}`;
      }
      return valor;

    case "R$":
      if (typeof valor === "string" && /^\d+$/.test(valor)) {
        const centavos = parseInt(valor);
        return centavos / 100;
      }
      return valor;

    case "N":
    case "ANO":
    case "N-MUN":
    case "N-SEQ":
      if (typeof valor === "string" && /^\d+$/.test(valor)) {
        return parseInt(valor);
      }
      return valor;

    default:
      return valor;
  }
};

export const formatarValorDeExcel = (
  valor: any,
  tipo: keyof typeof FORMATOS,
  tamanho: number,
): string => {
  if (!valor && valor !== 0) return "";

  switch (tipo) {
    case "DATA":
      if (valor instanceof Date) {
        const dia = valor.getUTCDate().toString().padStart(2, "0");
        const mes = (valor.getMonth() + 1).toString().padStart(2, "0");
        const ano = valor.getFullYear().toString();
        return `${dia}${mes}${ano}`;
      }
      if (typeof valor === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
        return valor.replace(/\//g, "");
      }
      if (typeof valor === "string" && /^\d{8}$/.test(valor)) {
        return valor;
      }
      return formatarData(valor);

    case "R$":
      if (typeof valor === "number") {
        const centavos = Math.round(valor * 100);
        return centavos.toString().padStart(tamanho, "0");
      }
      if (typeof valor === "string" && /^\d+$/.test(valor)) {
        return valor.padStart(tamanho, "0");
      }
      return formatarMoeda(valor, tamanho);

    case "N":
    case "ANO":
    case "N-MUN":
    case "N-SEQ":
      if (typeof valor === "number") {
        return Math.round(valor).toString().padStart(tamanho, "0");
      }
      return formatarNumero(valor, tamanho);

    default:
      return valor.toString();
  }
};
