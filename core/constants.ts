import type { iCampo } from "./types";

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
    DATA: ""
} as const;


const gerarInfoMensalR02 = () => {
    const meses = [
        "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const comeco = { ordem: 11, inicio: 191 };
    const tamanho = 14;
    const formato = "R$";

    let indice = 0;

    const output: any = {};
    for (const mes of meses) {
        /*  AVISO: ajustar para ".ordem"s receberem zeros à esquerda
            caso primeiro índice seja < 10 algum dia */
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


export const declaracaoModelo = {
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
            obrigatorio: true
        },
        anoCalendario: <iCampo>{
            ordem: "03",
            campo: "Ano-calendário",
            inicio: 18,
            fim: 21,
            tamanho: 4,
            formato: "ANO",
            obrigatorio: true
        },
        declaracaoRetificadora: <iCampo>{
            ordem: "04",
            campo: "Declaração Retificadora",
            inicio: 22,
            fim: 22,
            tamanho: 1,
            formato: "N",
            obrigatorio: true,
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
            obrigatorio: true
        },
        situacaoEspecial: <iCampo>{
            ordem: "06",
            campo: "Situação Especial",
            inicio: 33,
            fim: 33,
            tamanho: 1,
            formato: "N",
            obrigatorio: true,
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
            obrigatorio: true
        },
        codigoSituacaoEspecial: <iCampo>{
            ordem: "08",
            campo: "Código da situação especial",
            inicio: 42,
            fim: 43,
            tamanho: 2,
            formato: "N",
            obrigatorio: true,
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
            obrigatorio: true
        },
        cpfResponsavel: <iCampo>{
            ordem: "10",
            campo: "CPF do Responsável pela PJ",
            inicio: 104,
            fim: 114,
            tamanho: 11,
            formato: "CPF",
            obrigatorio: true
        },
        enderecoCompleto: <iCampo>{
            ordem: "11",
            campo: "Endereço completo do contribuinte",
            inicio: 115,
            fim: 234,
            tamanho: 120,
            formato: "X",
            obrigatorio: true
        },
        ufContribuinte: <iCampo>{
            ordem: "12",
            campo: "UF do Contribuinte",
            inicio: 235,
            fim: 236,
            tamanho: 2,
            formato: "X",
            obrigatorio: true
        },
        codigoMunicipio: <iCampo>{
            ordem: "13",
            campo: "Código do Município do Contribuinte",
            inicio: 237,
            fim: 240,
            tamanho: 4,
            formato: "N",
            obrigatorio: true
        },
        reservado14: <iCampo>{
            ordem: "14",
            campo: "Reservado",
            inicio: 241,
            fim: 260,
            tamanho: 20,
            formato: "BRANCO",
            obrigatorio: true
        },
        reservado15: <iCampo>{
            ordem: "15",
            campo: "Reservado",
            inicio: 261,
            fim: 270,
            tamanho: 10,
            formato: "BRANCO",
            obrigatorio: true
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
            formato: "X"
        },
        cnpjDeclarante: <iCampo>{
            ordem: "02",
            campo: "CNPJ do declarante",
            inicio: 4,
            fim: 17,
            tamanho: 14,
            formato: "CNPJ"
        },
        anoCalendario: <iCampo>{
            ordem: "03",
            campo: "Ano-calendário",
            inicio: 18,
            fim: 21,
            tamanho: 4,
            formato: "ANO"
        },
        sequencialLocacao: <iCampo>{
            ordem: "04",
            campo: "Sequencial da Locação",
            inicio: 22,
            fim: 28,
            tamanho: 7,
            formato: "N",
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
        ...gerarInfoMensalR02()
    },
    R03: {},
    R04: {},
    T09: {},
} as const;