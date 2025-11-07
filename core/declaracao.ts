import { declaracaoModelo, FORMATOS } from "./constants";
import type { iCampo, tCampoComValor, tDeclaracaoModelo } from "./types";


function preencherValorPadrao(campo: tCampoComValor<iCampo>) {
    if (["BRANCO", "ZERO", "EOL"].includes(campo.formato)) {
        if (campo.tamanho % FORMATOS[campo.formato].length !== 0)
            throw new Error(`Campo ${campo.campo} tem tamanho incompatível na configuração padrão.`);
        return FORMATOS[campo.formato].repeat(campo.tamanho / FORMATOS[campo.formato].length);
    }
    return campo?.valor || "";
};

export function gerarPrototipoDeclaracao<O extends tDeclaracaoModelo>()
    /*
        O: Objeto
        P: Primeiro nível
        S: Segundo nível <iCampo>
    */
    : { [P in keyof O]: { [S in keyof O[P]]: tCampoComValor<O[P][S]> } } {

    const out: any = {};

    for (const p in declaracaoModelo) {
        const typed_p = p as keyof typeof declaracaoModelo;
        out[typed_p] = {};

        for (const s in declaracaoModelo[typed_p]) {
            const typed_s = s as keyof typeof declaracaoModelo[typeof typed_p];
            const meta = declaracaoModelo[typed_p][typed_s] as iCampo;
            out[p][s] = {
                ...meta,
                valor: preencherValorPadrao(meta as tCampoComValor<iCampo>),
            };
        };
    };

    return out;
};