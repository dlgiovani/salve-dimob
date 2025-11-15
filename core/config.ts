/*
    Configurações do formato DIMOB

    DIMOB possui duas versões principais que diferem no tamanho
    do campo sequencial:
    - Versão antiga: 5 dígitos (posições 22-26)
    - Versão nova: 7 dígitos (posições 22-28)

    Esta diferença causa um deslocamento de 2 posições em todos
    os campos subsequentes dos registros R02, R03 e R04.
*/

export type tDIMOBConfig = {
    tamanhoSequencial: 5 | 7;
};

export const DIMOB_CONFIG: tDIMOBConfig = {
    tamanhoSequencial: 5, // Formato antigo (versão < 2.8g)
};

export const setDIMOBConfig = (config: Partial<tDIMOBConfig>) => {
    Object.assign(DIMOB_CONFIG, config);
};
