import { definicaoDeclaracao, FORMATOS } from "./constantes";
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

  for (const p in definicaoDeclaracao) {
    const typed_p = p as keyof typeof definicaoDeclaracao;
    out[typed_p] = {};

    for (const s in definicaoDeclaracao[typed_p]) {
      const typed_s = s as keyof (typeof definicaoDeclaracao)[typeof typed_p];
      const meta = definicaoDeclaracao[typed_p][typed_s] as iCampo;
      out[p][s] = {
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
