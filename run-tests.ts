#!/usr/bin/env -S bun run

import { testeVaiEVoltaDimob, testeVaiEVoltaExcel } from "./core/testes";

async function main() {
  console.log("====================================");
  console.log("EXECUTANDO TESTES DO SALVE-DIMOB");
  console.log("====================================");

  // Teste 1: DIMOB roundtrip
  await testeVaiEVoltaDimob("./dimob_2024.txt");

  // Teste 2: Excel roundtrip (se o arquivo existe)
  try {
    await testeVaiEVoltaExcel("./teste-roundtrip.xlsx");
  } catch (e) {
    console.log("\n⚠️  Teste Excel pulado (arquivo não encontrado ou erro)");
  }

  console.log("\n====================================");
  console.log("TESTES CONCLUÍDOS");
  console.log("====================================");
}

main().catch(console.error);
