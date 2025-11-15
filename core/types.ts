import type { definicaoDeclaracao, FORMATOS } from "./constantes";
import type { gerarPrototipoDeclaracao } from "./declaracao";

export interface iCampoEnum {
  valor: string;
  descricao: string;
}

export interface iCampo {
  ordem: string;
  campo: string;
  inicio: number;
  fim: number;
  tamanho: number;
  formato: keyof typeof FORMATOS;
  valor?: string;
  obrigatorio?: boolean;
  enum?: iCampoEnum[];
}

export type tCampoComValor<T> = T & {
  valor: string;
};

export type tDeclaracaoDefinicao = typeof definicaoDeclaracao;

export type tDeclaracao = {
  Header: ReturnType<typeof gerarPrototipoDeclaracao>["Header"];
  R01: ReturnType<typeof gerarPrototipoDeclaracao>["R01"];
  R02: Array<ReturnType<typeof gerarPrototipoDeclaracao>["R02"]>;
  R03: Array<ReturnType<typeof gerarPrototipoDeclaracao>["R03"]>;
  R04: Array<ReturnType<typeof gerarPrototipoDeclaracao>["R04"]>;
  T09: ReturnType<typeof gerarPrototipoDeclaracao>["T09"];
};
