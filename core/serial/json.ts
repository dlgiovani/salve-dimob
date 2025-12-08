import type { tDeclaracao } from "../types";
import { formatarValorParaExcel } from "../utils";

/**
 * Formata um registro individual para formato legível.
 *
 * Itera sobre todos os campos do registro e aplica formatação
 * nos valores usando formatarValorParaExcel(). Preserva todos
 * os metadados do campo (ordem, campo, formato, tamanho, etc.)
 * e apenas formata a propriedade `valor`.
 *
 * @param registro - Registro com valores em formato DIMOB raw
 * @returns Registro com valores formatados para leitura
 */
const formatarRegistroParaLeitura = (
  registro: Record<string, any>
): Record<string, any> => {
  const output: Record<string, any> = {};

  for (const chave in registro) {
    const campo = registro[chave];

    // Clona o campo para evitar mutação do objeto original
    const campoFormatado = { ...campo };

    // Formata apenas a propriedade valor usando a função existente
    campoFormatado.valor = formatarValorParaExcel(
      campo.valor,
      campo.formato
    );

    output[chave] = campoFormatado;
  }

  return output;
};

/**
 * Tipo para declaração formatada.
 *
 * A estrutura é idêntica a tDeclaracao, mas os valores dos campos
 * estão formatados para leitura humana ao invés do formato DIMOB raw.
 */
export type tDeclaracaoFormatada = {
  Header: Record<string, any>;
  R01: Record<string, any>;
  R02: Array<Record<string, any>>;
  R03: Array<Record<string, any>>;
  R04: Array<Record<string, any>>;
  T09: Record<string, any>;
};

/**
 * Formata uma declaração DIMOB para formato legível (valores convertidos).
 *
 * Converte valores do formato DIMOB raw para formato legível:
 * - Datas: DDMMYYYY → DD/MM/YYYY
 * - Moeda: centavos string → número decimal
 * - Números: string com zeros → integer
 *
 * Preserva toda a estrutura e metadados dos campos, alterando apenas
 * a propriedade `valor` de cada campo.
 *
 * @param declaracao - Declaração DIMOB com valores raw
 * @returns Objeto formatado com valores legíveis
 */
export const formatarDeclaracaoParaLeitura = (
  declaracao: tDeclaracao
): tDeclaracaoFormatada => {
  return {
    Header: formatarRegistroParaLeitura(declaracao.Header),
    R01: formatarRegistroParaLeitura(declaracao.R01),
    R02: declaracao.R02.map(formatarRegistroParaLeitura),
    R03: declaracao.R03.map(formatarRegistroParaLeitura),
    R04: declaracao.R04.map(formatarRegistroParaLeitura),
    T09: formatarRegistroParaLeitura(declaracao.T09),
  };
};

/**
 * Serializa uma declaração DIMOB para string JSON legível.
 *
 * Combina formatarDeclaracaoParaLeitura() com JSON.stringify()
 * para gerar JSON formatado e legível. Os valores são convertidos
 * do formato DIMOB raw para formato legível (datas, moeda, números).
 *
 * @param declaracao - Declaração DIMOB a serializar
 * @param pretty - Se true, usa indentação de 2 espaços (padrão: true)
 * @returns String JSON da declaração formatada
 */
export const serializarDeclaracaoParaJSON = (
  declaracao: tDeclaracao,
  pretty: boolean = true
): string => {
  const formatada = formatarDeclaracaoParaLeitura(declaracao);
  return JSON.stringify(formatada, null, pretty ? 2 : 0);
};
