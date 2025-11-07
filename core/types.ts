import type { declaracaoModelo, FORMATOS } from "./constants"

export interface iCampo {
    ordem: string
    campo: string
    inicio: number
    fim: number
    tamanho: number
    formato: keyof typeof FORMATOS
    valor?: string
}

export type tCampoComValor<T> = T & {
    valor: string
};

export type tDeclaracaoModelo = typeof declaracaoModelo;
