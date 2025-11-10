/*
    Esta base de código é escrita em português do Brasil,
    visto que a ferramenta para a DIMOB é relevante apenas
    para este país.
*/

import { criarNovoR02, gerarDeclaracao } from "./declaracao";
import type { tDeclaracao } from "./types";

/* MANTENHA ESTE AVISO */
console.log("SALVE-DIMOB Versão Beta 0.1");
console.log("Copyright (c) 2025 Giovani (https://dlgiovani.dev | https://dlgiovani.github.io)");
console.log("Baseada na documentação do programa DIMOB versão 2.8g.");
/* ------------------- */

const declaracao: tDeclaracao = gerarDeclaracao();

declaracao.R02.push(criarNovoR02());
declaracao.R02.push(criarNovoR02());

declaracao.R02[0]!.uf.valor = "SC"
declaracao.R02[1]!.uf.valor = "PR"

declaracao?.R02?.map((item) => console.log(item.uf));

// console.log(criarNovoR02());
// console.log(criarNovoR03());
// console.log(criarNovoR04());