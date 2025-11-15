import { DEFINICAO_DECLARACAO, FORMATOS } from "./constantes";
import type {
  iCampo,
  tCampoComValor,
  tDeclaracao,
  tDeclaracaoDefinicao,
} from "./types";

function preencherValorPadrao(campo: tCampoComValor<iCampo>) {
  if (["BRANCO", "ZERO", "EOL"].includes(campo.formato)) {
    if (campo.tamanho % FORMATOS[campo.formato].length !== 0)
      throw new Error(
        `Campo ${campo.campo} tem tamanho incompatível na configuração padrão.`,
      );
    return FORMATOS[campo.formato].repeat(
      campo.tamanho / FORMATOS[campo.formato].length,
    );
  }
  return campo?.valor || "";
}

export function gerarPrototipoDeclaracao<O extends tDeclaracaoDefinicao>() /*
        O: Objeto
        P: Primeiro nível
        S: Segundo nível <iCampo>
    */
: { [P in keyof O]: { [S in keyof O[P]]: tCampoComValor<O[P][S]> } } {
  const out: any = {};

  for (const chaveSecao in DEFINICAO_DECLARACAO) {
    const secaoKey = chaveSecao as keyof typeof DEFINICAO_DECLARACAO;
    out[secaoKey] = {};

    for (const chaveCampo in DEFINICAO_DECLARACAO[secaoKey]) {
      const campoKey = chaveCampo as keyof (typeof DEFINICAO_DECLARACAO)[typeof secaoKey];
      const meta = DEFINICAO_DECLARACAO[secaoKey][campoKey] as iCampo;
      out[chaveSecao][chaveCampo] = {
        ...meta,
        valor: preencherValorPadrao(meta as tCampoComValor<iCampo>),
      };
    }
  }

  return out as {
    [P in keyof O]: { [S in keyof O[P]]: tCampoComValor<O[P][S]> };
  };
}

export const gerarDeclaracao = (): tDeclaracao => {
  const prototipo = gerarPrototipoDeclaracao();
  return {
    Header: prototipo.Header,
    R01: prototipo.R01,
    R02: [],
    R03: [],
    R04: [],
    T09: prototipo.T09,
  };
};

export const criarNovoR01 = () => gerarPrototipoDeclaracao().R01;
export const criarNovoR02 = () => gerarPrototipoDeclaracao().R02;
export const criarNovoR03 = () => gerarPrototipoDeclaracao().R03;
export const criarNovoR04 = () => gerarPrototipoDeclaracao().R04;
