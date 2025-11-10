import type { iCampo, iCampoEnum } from "./types";

export const FORMATOS = {
    BRANCO: String.fromCharCode(0x20),
    ZERO: String.fromCharCode(0x30),
    EOL: String.fromCharCode(0x0D, 0x0A),
    X: "",
    N: "",
    CPF: "",
    CNPJ: "",
    "CPF/CNPJ": "",
    "CPF/CNPJ2": "",
    ANO: "",
    "R$": "",
    DATA: "",
    "X-UF": "", // UF
    "N-MUN": "", // MUNICÍPIO
    "N-SEQ": "" // SEQUENCIAL
} as const;

const TIPOS_IMOVEL = <iCampoEnum[]>[
    { valor: "U", descricao: "Imóvel Urbano" },
    { valor: "R", descricao: "Imóvel Rural" }
]


const gerarInfoMensalR02 = (): Record<string, iCampo> => {
    const meses = [
        "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const comeco = { ordem: 11, inicio: 191 };
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
            enum: [
                { valor: "0", descricao: "Não" },
                { valor: "1", descricao: "Sim" }
            ]
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
            enum: [
                { valor: "0", descricao: "Não" },
                { valor: "1", descricao: "Sim" }
            ]
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
            enum: [
                { valor: "00", descricao: "Normal" },
                { valor: "01", descricao: "Extinção" },
                { valor: "02", descricao: "Fusão" },
                { valor: "03", descricao: "Incorporação/Incorporada" },
                { valor: "04", descricao: "Cisão Total" },
            ]
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
    R02: {
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
            fim: 28,
            tamanho: 7,
            formato: "N-SEQ",
        },
        cpfCnpjLocador: <iCampo>{
            ordem: "05",
            campo: "CPF/CNPJ do Locador",
            inicio: 29,
            fim: 42,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeLocador: <iCampo>{
            ordem: "06",
            campo: "Nome/Nome Empresarial do Locador",
            inicio: 43,
            fim: 102,
            tamanho: 60,
            formato: "X",
        },
        cpfCnpjLocatario: <iCampo>{
            ordem: "07",
            campo: "CPF/CNPJ do Locatário",
            inicio: 103,
            fim: 116,
            tamanho: 14,
            formato: "CPF/CNPJ2",
        },
        nomeLocatario: <iCampo>{
            ordem: "08",
            campo: "Nome/Nome Empresarial do Locatário",
            inicio: 117,
            fim: 176,
            tamanho: 60,
            formato: "X",
        },
        numeroContrato: <iCampo>{
            ordem: "09",
            campo: "Número do Contrato",
            inicio: 177,
            fim: 182,
            tamanho: 6,
            formato: "X",
        },
        dataContrato: <iCampo>{
            ordem: "10",
            campo: "Data do Contrato",
            inicio: 183,
            fim: 190,
            tamanho: 14,
            formato: "DATA",
        },
        ...gerarInfoMensalR02(),
        tipoImovel: <iCampo>{
            ordem: "47",
            campo: "Tipo do Imóvel",
            inicio: 695,
            fim: 695,
            tamanho: 1,
            formato: "X",
            enum: TIPOS_IMOVEL
        },
        enderecoImovel: <iCampo>{
            ordem: "48",
            campo: "Endereço do Imóvel",
            inicio: 696,
            fim: 755,
            tamanho: 60,
            formato: "X",
        },
        cep: <iCampo>{
            ordem: "49",
            campo: "CEP",
            inicio: 756,
            fim: 763,
            tamanho: 8,
            formato: "N",
        },
        codigoMunicipioImovel: <iCampo>{
            ordem: "50",
            campo: "Código do Município do Imóvel",
            inicio: 764,
            fim: 767,
            tamanho: 4,
            formato: "N-MUN",
        },
        reservado51: <iCampo>{
            ordem: "51",
            campo: "Reservado",
            inicio: 768,
            fim: 787,
            tamanho: 20,
            formato: "BRANCO",
        },
        uf: <iCampo>{
            ordem: "52",
            campo: "UF",
            inicio: 788,
            fim: 789,
            tamanho: 2,
            formato: "X-UF",
        },
        reservado53: <iCampo>{
            ordem: "53",
            campo: "Reservado",
            inicio: 790,
            fim: 799,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "54",
            campo: "Delimitador de Registro",
            inicio: 800,
            fim: 801,
            tamanho: 2,
            formato: "EOL",
        },
    },
    // MARK: R03
    R03: {
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
            fim: 28,
            tamanho: 7, // há uma versão antiga com tamanho 5, não aplicável aqui.
            formato: "N-SEQ",
        },
        cpfCnpjComprador: <iCampo>{
            ordem: "05",
            campo: "CPF/CNPJ do Comprador",
            inicio: 29,
            fim: 42,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeComprador: <iCampo>{
            ordem: "06",
            campo: "Nome/Nome Empresarial do Comprador",
            inicio: 43,
            fim: 102,
            tamanho: 60,
            formato: "X",
        },
        numeroContrato: <iCampo>{
            ordem: "07",
            campo: "Número do Contrato",
            inicio: 103,
            fim: 108,
            tamanho: 6,
            formato: "X",
        },
        dataContrato: <iCampo>{
            ordem: "08",
            campo: "Data do Contrato",
            inicio: 109,
            fim: 116,
            tamanho: 8,
            formato: "DATA",
        },
        valorOperacao: <iCampo>{ // Entre os campos 9 e 10, ao menos um deve ser > 0
            ordem: "09",
            campo: "Valor da Operação",
            inicio: 117,
            fim: 130,
            tamanho: 14,
            formato: "R$",
        },
        valorPagoAno: <iCampo>{
            ordem: "10",
            campo: "Valor Pago no Ano",
            inicio: 131,
            fim: 144,
            tamanho: 14,
            formato: "R$",
        },
        tipoImovel: <iCampo>{
            ordem: "11",
            campo: "Tipo do Imóvel",
            inicio: 145,
            fim: 145,
            tamanho: 1,
            formato: "X",
            enum: TIPOS_IMOVEL
        },
        enderecoImovel: <iCampo>{
            ordem: "12",
            campo: "Endereço do Imóvel",
            inicio: 146,
            fim: 205,
            tamanho: 60,
            formato: "X",
        },
        cep: <iCampo>{
            ordem: "13",
            campo: "CEP",
            inicio: 206,
            fim: 213,
            tamanho: 8,
            formato: "N",
        },
        codigoMunicipioImovel: <iCampo>{
            ordem: "14",
            campo: "Código do Município do Imóvel",
            inicio: 214,
            fim: 217,
            tamanho: 4,
            formato: "N-MUN",
        },
        reservado15: <iCampo>{
            ordem: "15",
            campo: "Reservado",
            inicio: 218,
            fim: 237,
            tamanho: 20,
            formato: "BRANCO",
        },
        UF: <iCampo>{
            ordem: "16",
            campo: "UF",
            inicio: 238,
            fim: 239,
            tamanho: 2,
            formato: "X-UF",
        },
        reservado17: <iCampo>{
            ordem: "17",
            campo: "Reservado",
            inicio: 240,
            fim: 249,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "18",
            campo: "Delimitador de Registro",
            inicio: 250,
            fim: 251,
            tamanho: 2,
            formato: "EOL",
        },
    },
    R04: {
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
            fim: 28,
            tamanho: 7,
            formato: "N-SEQ",
        },
        cpfCnpjComprador: <iCampo>{
            ordem: "05",
            campo: "CPF/CNPJ do Comprador",
            inicio: 29,
            fim: 42,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeComprador: <iCampo>{
            ordem: "06",
            campo: "Nome/Nome Empresarial do Comprador",
            inicio: 43,
            fim: 102,
            tamanho: 60,
            formato: "X",
        },
        cpfCnpjVendedor: <iCampo>{
            ordem: "07",
            campo: "CPF/CNPJ do Vendedor",
            inicio: 103,
            fim: 116,
            tamanho: 14,
            formato: "CPF/CNPJ",
        },
        nomeVendedor: <iCampo>{
            ordem: "08",
            campo: "Nome/Nome Empresarial do Vendedor",
            inicio: 117,
            fim: 176,
            tamanho: 60,
            formato: "X",
        },
        numeroContrato: <iCampo>{
            ordem: "09",
            campo: "Número do Contrato",
            inicio: 177,
            fim: 182,
            tamanho: 6,
            formato: "X",
        },
        dataContrato: <iCampo>{
            ordem: "10",
            campo: "Data do Contrato",
            inicio: 183,
            fim: 190,
            tamanho: 8,
            formato: "DATA",
        },
        valorVenda: <iCampo>{
            ordem: "11",
            campo: "Valor da Venda",
            inicio: 191,
            fim: 204,
            tamanho: 14,
            formato: "R$",
        },
        valorComissao: <iCampo>{
            ordem: "12",
            campo: "Valor da Comissão",
            inicio: 205,
            fim: 218,
            tamanho: 14,
            formato: "R$",
        },
        tipoImovel: <iCampo>{
            ordem: "13",
            campo: "Tipo do Imóvel",
            inicio: 219,
            fim: 219,
            tamanho: 1,
            formato: "X",
            enum: TIPOS_IMOVEL
        },
        enderecoImovel: <iCampo>{
            ordem: "14",
            campo: "Endereço do Imóvel",
            inicio: 220,
            fim: 279,
            tamanho: 60,
            formato: "X",
        },
        cep: <iCampo>{
            ordem: "15",
            campo: "CEP",
            inicio: 280,
            fim: 287,
            tamanho: 8,
            formato: "N",
        },
        codigoMunicipioImovel: <iCampo>{
            ordem: "16",
            campo: "Código do Município do Imóvel",
            inicio: 288,
            fim: 291,
            tamanho: 4,
            formato: "N",
        },
        reservado17: <iCampo>{
            ordem: "17",
            campo: "Reservado",
            inicio: 292,
            fim: 311,
            tamanho: 20,
            formato: "BRANCO",
        },
        uf: <iCampo>{
            ordem: "18",
            campo: "UF",
            inicio: 312,
            fim: 313,
            tamanho: 2,
            formato: "X",
        },
        reservado19: <iCampo>{
            ordem: "19",
            campo: "Reservado",
            inicio: 314,
            fim: 323,
            tamanho: 10,
            formato: "BRANCO",
        },
        delimitador: <iCampo>{
            ordem: "20",
            campo: "Delimitador de Registro",
            inicio: 324,
            fim: 325,
            tamanho: 2,
            formato: "EOL",
        },
    },
    T09: {
        tipo: <iCampo>{
            ordem: "01",
            campo: "Tipo",
            inicio: 1,
            fim: 2,
            tamanho: 2,
            formato: "X",
            valor: "T09"
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