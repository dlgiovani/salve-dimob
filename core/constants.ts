import type { iCampo } from "./types";

export const FORMATOS = {
    BRANCO: String.fromCharCode(0x20),
    ZERO: String.fromCharCode(0x30),
    EOL: String.fromCharCode(0x0D, 0x0A),
    X: "", 
    N: ""
} as const;


export const declaracaoModelo = {
    Header: {
        sistema: <iCampo>{
            ordem: "01",
            campo: "Sistema",
            inicio: 1,
            fim: 5,
            tamanho: 5,
            formato: "X",
            valor: "DIMOB"
        },
        reservado: <iCampo>{
            ordem: "02",
            campo: "Reservado",
            inicio: 6,
            fim: 374,
            tamanho: 369,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "03",
            campo: "Delimitador de Registro",
            inicio: 375,
            fim: 376,
            tamanho: 2,
            formato: "EOL"
        }
    },
    R01: {},
    R02: {},
    R03: {},
    R04: {},
    T09: {},
} as const;