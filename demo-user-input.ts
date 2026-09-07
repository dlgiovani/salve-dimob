#!/usr/bin/env -S bun run

/**
 * Demonstração do fluxo completo de entrada/saída de usuário
 */

import {
  formatarValorParaExcel,
  formatarValorDeExcel,
} from "./core/index";

console.log("=== DEMO: Formatação Bidirecional ===\n");

// Cenário: Sistema tem valor DIMOB raw, precisa exibir e aceitar input do usuário

console.log("1️⃣  EXIBIÇÃO PARA USUÁRIO (DIMOB → Amigável)\n");

// Data
const dataRaw = "15052024";
const dataDisplay = formatarValorParaExcel(dataRaw, "DATA");
console.log(`Data armazenada: "${dataRaw}"`);
console.log(`Exibir para usuário: "${dataDisplay}"`);
console.log();

// Valor monetário
const valorRaw = "000000150050";
const valorDisplay = formatarValorParaExcel(valorRaw, "R$");
console.log(`Valor armazenado: "${valorRaw}"`);
console.log(`Exibir para usuário: ${valorDisplay}`);
console.log();

// Número
const numeroRaw = "00123";
const numeroDisplay = formatarValorParaExcel(numeroRaw, "N");
console.log(`Número armazenado: "${numeroRaw}"`);
console.log(`Exibir para usuário: ${numeroDisplay}`);
console.log();

console.log("2️⃣  INPUT DO USUÁRIO (Amigável → DIMOB)\n");

// Usuário digita data formatada
const userInputData = "25/12/2024";
const dataDIMOB = formatarValorDeExcel(userInputData, "DATA", 8);
console.log(`Usuário digitou: "${userInputData}"`);
console.log(`Salvar no sistema: "${dataDIMOB}"`);
console.log();

// Usuário digita valor decimal
const userInputValor = 1234.56;
const valorDIMOB = formatarValorDeExcel(userInputValor, "R$", 14);
console.log(`Usuário digitou: ${userInputValor}`);
console.log(`Salvar no sistema: "${valorDIMOB}"`);
console.log();

// Usuário digita número
const userInputNumero = 456;
const numeroDIMOB = formatarValorDeExcel(userInputNumero, "N", 5);
console.log(`Usuário digitou: ${userInputNumero}`);
console.log(`Salvar no sistema: "${numeroDIMOB}"`);
console.log();

console.log("3️⃣  ROUNDTRIP COMPLETO (DIMOB → Display → Input → DIMOB)\n");

// Simular edição de campo pelo usuário
const campoOriginal = "01012024";
console.log(`Valor original no sistema: "${campoOriginal}"`);

// Exibir para usuário
const paraUsuario = formatarValorParaExcel(campoOriginal, "DATA");
console.log(`Exibido ao usuário: "${paraUsuario}"`);

// Usuário edita para nova data
const usuarioEditou = "31/12/2024";
console.log(`Usuário editou para: "${usuarioEditou}"`);

// Converter de volta para DIMOB
const novoValorDIMOB = formatarValorDeExcel(usuarioEditou, "DATA", 8);
console.log(`Salvo no sistema: "${novoValorDIMOB}"`);

// Verificar integridade
const verificacao = formatarValorParaExcel(novoValorDIMOB, "DATA");
console.log(`Verificação (exibir novamente): "${verificacao}"`);
console.log(`✓ Roundtrip ${verificacao === usuarioEditou ? "PERFEITO" : "ERRO"}!`);
console.log();

console.log("4️⃣  CASOS ESPECIAIS\n");

// Date object direto
const dateObj = new Date("2024-06-15");
const dateDIMOB = formatarValorDeExcel(dateObj, "DATA", 8);
console.log(`Date object (2024-06-15): "${dateDIMOB}"`);
console.log();

// String DIMOB já formatada (pass-through)
const jaDIMOB = "20052024";
const passThrough = formatarValorDeExcel(jaDIMOB, "DATA", 8);
console.log(`String DIMOB ("20052024"): "${passThrough}"`);
console.log(`✓ Mantém formato: ${passThrough === jaDIMOB ? "SIM" : "NÃO"}`);
console.log();

console.log("=== DEMO CONCLUÍDA ===");
console.log("\nUSO NO WEBSITE:");
console.log("// Exibir valor");
console.log("const display = formatarValorParaExcel(campo.valor, campo.formato);");
console.log("");
console.log("// Salvar input do usuário");
console.log("campo.valor = formatarValorDeExcel(userInput, campo.formato, campo.tamanho);");
