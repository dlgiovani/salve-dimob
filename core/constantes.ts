import type { iCampo, iCampoEnum } from "./types";
import { DIMOB_CONFIG } from "./config";

export const FORMATOS = {
    "BRANCO": String.fromCharCode(0x20),
    "ZERO": String.fromCharCode(0x30),
    "EOL": String.fromCharCode(0x0D, 0x0A),
    "X": "",
    "N": "",
    "CPF": "",
    "CNPJ": "",
    "CPF/CNPJ": "",
    "CPF/CNPJ2": "",
    "ANO": "",
    "R$": "",
    "DATA": "",
    "X-UF": "", // UF
    "N-MUN": "", // MUNICÍPIO
    "N-SEQ": "" // SEQUENCIAL
} as const;

const TIPOS_IMOVEL = <iCampoEnum[]>[
    { valor: "U", descricao: "Imóvel Urbano" },
    { valor: "R", descricao: "Imóvel Rural" }
]

const NAO_SIM = <iCampoEnum[]>[
    { valor: "0", descricao: "Não" },
    { valor: "1", descricao: "Sim" }
]

const SITU_ESPECIAL = <iCampoEnum[]>[
    { valor: "00", descricao: "Normal" },
    { valor: "01", descricao: "Extinção" },
    { valor: "02", descricao: "Fusão" },
    { valor: "03", descricao: "Incorporação/Incorporada" },
    { valor: "04", descricao: "Cisão Total" },
]

const calcularOffset = () => {
    return DIMOB_CONFIG.tamanhoSequencial === 5 ? -2 : 0;
};

const gerarInfoMensalR02 = (offset: number): Record<string, iCampo> => {
    const meses = [
        "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const comeco = { ordem: 11, inicio: 191 + offset };
    const tamanho = 14;
    const formato = "R$";

    let indice = 0;

    const output: Record<string, iCampo> = {};
    for (const mes of meses) {
        /*  AVISO: ajustar para ".ordem"s receberem zeros à esquerda
            caso ordem do primeiro campo seja < 10 algum dia */
        const inicio = () => comeco.inicio + ((tamanho) * indice);

        output[`valorAluguel${mes}`] = <iCampo>{
            ordem: (comeco.ordem + indice).toString(),
            campo: `Valor do Aluguel no mês de ${mes}`,
            inicio: inicio(),
            fim: inicio() + tamanho - 1,
            tamanho,
            formato,
        };
        indice++;

        output[`valorComissao${mes}`] = <iCampo>{
            ordem: (comeco.ordem + indice).toString(),
            campo: `Valor da Comissão no mês de ${mes}`,
            inicio: inicio(),
            fim: inicio() + tamanho - 1,
            tamanho,
            formato,
        };
        indice++;

        output[`valorImposto${mes}`] = <iCampo>{
            ordem: (comeco.ordem + indice).toString(),
            campo: `Valor do Imposto no mês de ${mes}`,
            inicio: inicio(),
            fim: inicio() + tamanho - 1,
            tamanho,
            formato,
        };
        indice++;
    };

    return output;
};

const gerarR02 = () => {
    const offset = calcularOffset();
    const tamanhoSeq = DIMOB_CONFIG.tamanhoSequencial;

    return {
        tipo: <iCampo>{
            ordem: "01",
            campo: "Tipo",
            inicio: 1,
            fim: 3,
            tamanho: 3,
            formato: "X",
            valor: "R02"
        },
        cnpjDeclarante: <iCampo>{
            ordem: "02",
            campo: "CNPJ do declarante",
            inicio: 4,
            fim: 17,
            tamanho: 14,
            formato: "CNPJ",
        },
        anoCalendario: <iCampo>{
            ordem: "03",
            campo: "Ano-calendário",
            inicio: 18,
            fim: 21,
            tamanho: 4,
            formato: "ANO",
        },
        sequencialLocacao: <iCampo>{
            ordem: "04",
            campo: "Sequencial da Locação",
            inicio: 22,
            fim: 21 + tamanhoSeq,
            tamanho: tamanhoSeq,
            formato: "N-SEQ",
        },
        cpfCnpjLocador: <iCampo>{
            ordem: "05",
            campo: "CPF/CNPJ do Locador",
            inicio: 29 + offset,
            fim: 42 + offset,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeLocador: <iCampo>{
            ordem: "06",
            campo: "Nome/Nome Empresarial do Locador",
            inicio: 43 + offset,
            fim: 102 + offset,
            tamanho: 60,
            formato: "X",
        },
        cpfCnpjLocatario: <iCampo>{
            ordem: "07",
            campo: "CPF/CNPJ do Locatário",
            inicio: 103 + offset,
            fim: 116 + offset,
            tamanho: 14,
            formato: "CPF/CNPJ2",
        },
        nomeLocatario: <iCampo>{
            ordem: "08",
            campo: "Nome/Nome Empresarial do Locatário",
            inicio: 117 + offset,
            fim: 176 + offset,
            tamanho: 60,
            formato: "X",
        },
        numeroContrato: <iCampo>{
            ordem: "09",
            campo: "Número do Contrato",
            inicio: 177 + offset,
            fim: 182 + offset,
            tamanho: 6,
            formato: "X",
        },
        dataContrato: <iCampo>{
            ordem: "10",
            campo: "Data do Contrato",
            inicio: 183 + offset,
            fim: 190 + offset,
            tamanho: 8,
            formato: "DATA",
        },
        ...gerarInfoMensalR02(offset),
        tipoImovel: <iCampo>{
            ordem: "47",
            campo: "Tipo do Imóvel",
            inicio: 695 + offset,
            fim: 695 + offset,
            tamanho: 1,
            formato: "X",
            enum: TIPOS_IMOVEL
        },
        enderecoImovel: <iCampo>{
            ordem: "48",
            campo: "Endereço do Imóvel",
            inicio: 696 + offset,
            fim: 755 + offset,
            tamanho: 60,
            formato: "X",
        },
        cep: <iCampo>{
            ordem: "49",
            campo: "CEP",
            inicio: 756 + offset,
            fim: 763 + offset,
            tamanho: 8,
            formato: "N",
        },
        codigoMunicipioImovel: <iCampo>{
            ordem: "50",
            campo: "Código do Município do Imóvel",
            inicio: 764 + offset,
            fim: 767 + offset,
            tamanho: 4,
            formato: "N-MUN",
        },
        reservado51: <iCampo>{
            ordem: "51",
            campo: "Reservado",
            inicio: 768 + offset,
            fim: 787 + offset,
            tamanho: 20,
            formato: "BRANCO",
        },
        uf: <iCampo>{
            ordem: "52",
            campo: "UF",
            inicio: 788 + offset,
            fim: 789 + offset,
            tamanho: 2,
            formato: "X-UF",
        },
        reservado53: <iCampo>{
            ordem: "53",
            campo: "Reservado",
            inicio: 790 + offset,
            fim: 799 + offset,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "54",
            campo: "Delimitador de Registro",
            inicio: 800 + offset,
            fim: 801 + offset,
            tamanho: 2,
            formato: "EOL",
        },
    };
};

const gerarR03 = () => {
    const offset = calcularOffset();
    const tamanhoSeq = DIMOB_CONFIG.tamanhoSequencial;

    return {
        tipo: <iCampo>{
            ordem: "01",
            campo: "Tipo",
            inicio: 1,
            fim: 3,
            tamanho: 3,
            formato: "X",
            valor: "R03"
        },
        cnpjDeclarante: <iCampo>{
            ordem: "02",
            campo: "CNPJ do Declarante",
            inicio: 4,
            fim: 17,
            tamanho: 14,
            formato: "CNPJ",
        },
        anoCalendario: <iCampo>{
            ordem: "03",
            campo: "Ano-calendário",
            inicio: 18,
            fim: 21,
            tamanho: 4,
            formato: "ANO",
        },
        sequencialVenda: <iCampo>{
            ordem: "04",
            campo: "Sequencial da Venda",
            inicio: 22,
            fim: 21 + tamanhoSeq,
            tamanho: tamanhoSeq,
            formato: "N-SEQ",
        },
        cpfCnpjComprador: <iCampo>{
            ordem: "05",
            campo: "CPF/CNPJ do Comprador",
            inicio: 29 + offset,
            fim: 42 + offset,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeComprador: <iCampo>{
            ordem: "06",
            campo: "Nome/Nome Empresarial do Comprador",
            inicio: 43 + offset,
            fim: 102 + offset,
            tamanho: 60,
            formato: "X",
        },
        numeroContrato: <iCampo>{
            ordem: "07",
            campo: "Número do Contrato",
            inicio: 103 + offset,
            fim: 108 + offset,
            tamanho: 6,
            formato: "X",
        },
        dataContrato: <iCampo>{
            ordem: "08",
            campo: "Data do Contrato",
            inicio: 109 + offset,
            fim: 116 + offset,
            tamanho: 8,
            formato: "DATA",
        },
        valorOperacao: <iCampo>{
            ordem: "09",
            campo: "Valor da Operação",
            inicio: 117 + offset,
            fim: 130 + offset,
            tamanho: 14,
            formato: "R$",
        },
        valorPagoAno: <iCampo>{
            ordem: "10",
            campo: "Valor Pago no Ano",
            inicio: 131 + offset,
            fim: 144 + offset,
            tamanho: 14,
            formato: "R$",
        },
        tipoImovel: <iCampo>{
            ordem: "11",
            campo: "Tipo do Imóvel",
            inicio: 145 + offset,
            fim: 145 + offset,
            tamanho: 1,
            formato: "X",
            enum: TIPOS_IMOVEL
        },
        enderecoImovel: <iCampo>{
            ordem: "12",
            campo: "Endereço do Imóvel",
            inicio: 146 + offset,
            fim: 205 + offset,
            tamanho: 60,
            formato: "X",
        },
        cep: <iCampo>{
            ordem: "13",
            campo: "CEP",
            inicio: 206 + offset,
            fim: 213 + offset,
            tamanho: 8,
            formato: "N",
        },
        codigoMunicipioImovel: <iCampo>{
            ordem: "14",
            campo: "Código do Município do Imóvel",
            inicio: 214 + offset,
            fim: 217 + offset,
            tamanho: 4,
            formato: "N-MUN",
        },
        reservado15: <iCampo>{
            ordem: "15",
            campo: "Reservado",
            inicio: 218 + offset,
            fim: 237 + offset,
            tamanho: 20,
            formato: "BRANCO",
        },
        UF: <iCampo>{
            ordem: "16",
            campo: "UF",
            inicio: 238 + offset,
            fim: 239 + offset,
            tamanho: 2,
            formato: "X-UF",
        },
        reservado17: <iCampo>{
            ordem: "17",
            campo: "Reservado",
            inicio: 240 + offset,
            fim: 249 + offset,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "18",
            campo: "Delimitador de Registro",
            inicio: 250 + offset,
            fim: 251 + offset,
            tamanho: 2,
            formato: "EOL",
        },
    };
};

const gerarR04 = () => {
    const offset = calcularOffset();
    const tamanhoSeq = DIMOB_CONFIG.tamanhoSequencial;

    return {
        tipo: <iCampo>{
            ordem: "01",
            campo: "Tipo",
            inicio: 1,
            fim: 3,
            tamanho: 3,
            formato: "X",
            valor: "R04"
        },
        cnpjDeclarante: <iCampo>{
            ordem: "02",
            campo: "CNPJ do Declarante",
            inicio: 4,
            fim: 17,
            tamanho: 14,
            formato: "CNPJ",
        },
        anoCalendario: <iCampo>{
            ordem: "03",
            campo: "Ano-calendário",
            inicio: 18,
            fim: 21,
            tamanho: 4,
            formato: "ANO",
        },
        sequencialVenda: <iCampo>{
            ordem: "04",
            campo: "Sequencial da Venda",
            inicio: 22,
            fim: 21 + tamanhoSeq,
            tamanho: tamanhoSeq,
            formato: "N-SEQ",
        },
        cpfCnpjComprador: <iCampo>{
            ordem: "05",
            campo: "CPF/CNPJ do Comprador",
            inicio: 29 + offset,
            fim: 42 + offset,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeComprador: <iCampo>{
            ordem: "06",
            campo: "Nome/Nome Empresarial do Comprador",
            inicio: 43 + offset,
            fim: 102 + offset,
            tamanho: 60,
            formato: "X",
        },
        cpfCnpjVendedor: <iCampo>{
            ordem: "07",
            campo: "CPF/CNPJ do Vendedor",
            inicio: 103 + offset,
            fim: 116 + offset,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeVendedor: <iCampo>{
            ordem: "08",
            campo: "Nome/Nome Empresarial do Vendedor",
            inicio: 117 + offset,
            fim: 176 + offset,
            tamanho: 60,
            formato: "X",
        },
        numeroContrato: <iCampo>{
            ordem: "09",
            campo: "Número do Contrato",
            inicio: 177 + offset,
            fim: 182 + offset,
            tamanho: 6,
            formato: "X",
        },
        dataContrato: <iCampo>{
            ordem: "10",
            campo: "Data do Contrato",
            inicio: 183 + offset,
            fim: 190 + offset,
            tamanho: 8,
            formato: "DATA",
        },
        valorVenda: <iCampo>{
            ordem: "11",
            campo: "Valor da Venda",
            inicio: 191 + offset,
            fim: 204 + offset,
            tamanho: 14,
            formato: "R$",
        },
        valorComissao: <iCampo>{
            ordem: "12",
            campo: "Valor da Comissão",
            inicio: 205 + offset,
            fim: 218 + offset,
            tamanho: 14,
            formato: "R$",
        },
        tipoImovel: <iCampo>{
            ordem: "13",
            campo: "Tipo do Imóvel",
            inicio: 219 + offset,
            fim: 219 + offset,
            tamanho: 1,
            formato: "X",
            enum: TIPOS_IMOVEL
        },
        enderecoImovel: <iCampo>{
            ordem: "14",
            campo: "Endereço do Imóvel",
            inicio: 220 + offset,
            fim: 279 + offset,
            tamanho: 60,
            formato: "X",
        },
        cep: <iCampo>{
            ordem: "15",
            campo: "CEP",
            inicio: 280 + offset,
            fim: 287 + offset,
            tamanho: 8,
            formato: "N",
        },
        codigoMunicipioImovel: <iCampo>{
            ordem: "16",
            campo: "Código do Município do Imóvel",
            inicio: 288 + offset,
            fim: 291 + offset,
            tamanho: 4,
            formato: "N",
        },
        reservado17: <iCampo>{
            ordem: "17",
            campo: "Reservado",
            inicio: 292 + offset,
            fim: 311 + offset,
            tamanho: 20,
            formato: "BRANCO",
        },
        uf: <iCampo>{
            ordem: "18",
            campo: "UF",
            inicio: 312 + offset,
            fim: 313 + offset,
            tamanho: 2,
            formato: "X",
        },
        reservado19: <iCampo>{
            ordem: "19",
            campo: "Reservado",
            inicio: 314 + offset,
            fim: 323 + offset,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "20",
            campo: "Delimitador de Registro",
            inicio: 324 + offset,
            fim: 325 + offset,
            tamanho: 2,
            formato: "EOL",
        },
    };
};

export const secoesDeclaracao = {
    // 'Header': 'Cabeçalho',
    'R01': 'Dados Iniciais',
    'R02': 'Locação',
    'R03': 'Construção e Incorporação',
    'R04': 'Intermediação de Venda',
    // 'T09': 'Trailler da Declaração',
};

export const definicaoDeclaracao = {
    // MARK: Header
    Header: {
        sistema: <iCampo>{
            ordem: "01",
            campo: "Sistema",
            inicio: 1,
            fim: 5,
            tamanho: 5,
            formato: "X",
            valor: "DIMOB",
        },
        reservado02: <iCampo>{
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
    // MARK: R01
    R01: {
        tipo: <iCampo>{
            ordem: "01",
            campo: "Tipo",
            inicio: 1,
            fim: 3,
            tamanho: 3,
            formato: "X",
            valor: "R01"
        },
        cnpjDeclarante: <iCampo>{
            ordem: "02",
            campo: "CNPJ do declarante",
            inicio: 4,
            fim: 17,
            tamanho: 14,
            formato: "CNPJ",
        },
        anoCalendario: <iCampo>{
            ordem: "03",
            campo: "Ano-calendário",
            inicio: 18,
            fim: 21,
            tamanho: 4,
            formato: "ANO",
        },
        declaracaoRetificadora: <iCampo>{
            ordem: "04",
            campo: "Declaração Retificadora",
            inicio: 22,
            fim: 22,
            tamanho: 1,
            formato: "N",
            enum: NAO_SIM
        },
        numeroRecibo: <iCampo>{
            ordem: "05",
            campo: "Número do Recibo",
            inicio: 23,
            fim: 32,
            tamanho: 10,
            formato: "N",
        },
        situacaoEspecial: <iCampo>{
            ordem: "06",
            campo: "Situação Especial",
            inicio: 33,
            fim: 33,
            tamanho: 1,
            formato: "N",
            enum: NAO_SIM
        },
        dataEventoEspecial: <iCampo>{
            ordem: "07",
            campo: "Data do evento situação especial",
            inicio: 34,
            fim: 41,
            tamanho: 8,
            formato: "N",
        },
        codigoSituacaoEspecial: <iCampo>{
            ordem: "08",
            campo: "Código da situação especial",
            inicio: 42,
            fim: 43,
            tamanho: 2,
            formato: "N",
            enum: SITU_ESPECIAL
        },
        nomeEmpresarial: <iCampo>{
            ordem: "09",
            campo: "Nome Empresarial",
            inicio: 44,
            fim: 103,
            tamanho: 60,
            formato: "X",
        },
        cpfResponsavel: <iCampo>{
            ordem: "10",
            campo: "CPF do Responsável pela PJ",
            inicio: 104,
            fim: 114,
            tamanho: 11,
            formato: "CPF",
        },
        enderecoCompleto: <iCampo>{
            ordem: "11",
            campo: "Endereço completo do contribuinte",
            inicio: 115,
            fim: 234,
            tamanho: 120,
            formato: "X",
        },
        ufContribuinte: <iCampo>{
            ordem: "12",
            campo: "UF do Contribuinte",
            inicio: 235,
            fim: 236,
            tamanho: 2,
            formato: "X-UF",
        },
        codigoMunicipio: <iCampo>{
            ordem: "13",
            campo: "Código do Município do Contribuinte",
            inicio: 237,
            fim: 240,
            tamanho: 4,
            formato: "N-MUN",
        },
        reservado14: <iCampo>{
            ordem: "14",
            campo: "Reservado",
            inicio: 241,
            fim: 260,
            tamanho: 20,
            formato: "BRANCO",
        },
        reservado15: <iCampo>{
            ordem: "15",
            campo: "Reservado",
            inicio: 261,
            fim: 270,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "16",
            campo: "Delimitador de Registro",
            inicio: 271,
            fim: 272,
            tamanho: 2,
            formato: "EOL"
        },
    },
    // MARK: R02
    R02: gerarR02(),
    // MARK: R03
    R03: gerarR03(),
    R04: gerarR04(),
    T09: {
        tipo: <iCampo>{
            ordem: "01",
            campo: "Tipo",
            inicio: 1,
            fim: 2,
            tamanho: 2,
            formato: "X",
            valor: "T9"
        },
        reservado02: <iCampo>{
            ordem: "02",
            campo: "Reservado",
            inicio: 3,
            fim: 102,
            tamanho: 100,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "03",
            campo: "Delimitador de Registro",
            inicio: 103,
            fim: 104,
            tamanho: 2,
            formato: "EOL",
        },
    },
} as const;