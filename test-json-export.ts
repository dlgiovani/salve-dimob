#!/usr/bin/env -S bun run

/**
 * Script de teste para funcionalidade de exportação JSON
 */

import {
  gerarDeclaracao,
  formatarValorParaExcel,
  formatarDeclaracaoParaLeitura,
  serializarDeclaracaoParaJSON,
  criarNovoR02,
} from "./core/index";

console.log("=== Teste: formatarValorParaExcel ===\n");

// Teste 1: Formatação de data
const dataRaw = "15052024";
const dataFormatada = formatarValorParaExcel(dataRaw, "DATA");
console.log(`Data raw: ${dataRaw}`);
console.log(`Data formatada: ${dataFormatada}`);
console.log(`✓ Esperado: 15/05/2024\n`);

// Teste 2: Formatação de moeda
const moedaRaw = "000000150050";
const moedaFormatada = formatarValorParaExcel(moedaRaw, "R$");
console.log(`Moeda raw: ${moedaRaw}`);
console.log(`Moeda formatada: ${moedaFormatada}`);
console.log(`✓ Esperado: 1500.5\n`);

// Teste 3: Formatação de número
const numeroRaw = "00123";
const numeroFormatado = formatarValorParaExcel(numeroRaw, "N");
console.log(`Número raw: ${numeroRaw}`);
console.log(`Número formatado: ${numeroFormatado}`);
console.log(`✓ Esperado: 123\n`);

// Teste 4: CPF/CNPJ (deve manter raw)
const cpfRaw = "12345678901";
const cpfFormatado = formatarValorParaExcel(cpfRaw, "CPF");
console.log(`CPF raw: ${cpfRaw}`);
console.log(`CPF formatado: ${cpfFormatado}`);
console.log(`✓ Esperado: 12345678901 (sem formatação)\n`);

console.log("=== Teste: formatarDeclaracaoParaLeitura ===\n");

// Criar declaração de teste
const declaracao = gerarDeclaracao();
declaracao.Header.sistema.valor = "DIMOB";
declaracao.R01.cnpjDeclarante.valor = "12345678000195";
declaracao.R01.anoCalendario.valor = "2024";

// Adicionar um R02 de teste
const r02 = criarNovoR02();
r02.dataContrato.valor = "01012024";
r02.valorAluguelJaneiro.valor = "000000150050";
declaracao.R02.push(r02);

// Formatar declaração
const declaracaoFormatada = formatarDeclaracaoParaLeitura(declaracao);

console.log("Header.sistema (formatado):");
console.log(`  valor: ${declaracaoFormatada.Header.sistema.valor}`);
console.log(`  formato: ${declaracaoFormatada.Header.sistema.formato}\n`);

console.log("R01.anoCalendario (formatado):");
console.log(`  valor: ${declaracaoFormatada.R01.anoCalendario.valor}`);
console.log(`  formato: ${declaracaoFormatada.R01.anoCalendario.formato}`);
console.log(`✓ Esperado: 2024 (número)\n`);

console.log("R02[0].dataContrato (formatado):");
console.log(`  valor: ${declaracaoFormatada.R02[0].dataContrato.valor}`);
console.log(`  formato: ${declaracaoFormatada.R02[0].dataContrato.formato}`);
console.log(`✓ Esperado: 01/01/2024\n`);

console.log("R02[0].valorAluguelJaneiro (formatado):");
console.log(`  valor: ${declaracaoFormatada.R02[0].valorAluguelJaneiro.valor}`);
console.log(`  formato: ${declaracaoFormatada.R02[0].valorAluguelJaneiro.formato}`);
console.log(`✓ Esperado: 1500.5\n`);

console.log("=== Teste: serializarDeclaracaoParaJSON ===\n");

// Testar serialização JSON
const jsonPretty = serializarDeclaracaoParaJSON(declaracao);
const jsonCompact = serializarDeclaracaoParaJSON(declaracao, false);

console.log("JSON pretty-printed (primeiras 500 chars):");
console.log(jsonPretty.substring(0, 500) + "...\n");

console.log(`Tamanho JSON pretty: ${jsonPretty.length} caracteres`);
console.log(`Tamanho JSON compact: ${jsonCompact.length} caracteres`);
console.log(`✓ JSON pretty deve ser maior que compact\n`);

// Verificar se é JSON válido
try {
  const parsed = JSON.parse(jsonPretty);
  console.log("✓ JSON pretty é válido (pode ser parseado)");
  console.log(`✓ Estrutura: ${Object.keys(parsed).join(", ")}\n`);
} catch (e) {
  console.error("✗ ERRO: JSON pretty inválido!");
}

try {
  const parsed = JSON.parse(jsonCompact);
  console.log("✓ JSON compact é válido (pode ser parseado)\n");
} catch (e) {
  console.error("✗ ERRO: JSON compact inválido!");
}

console.log("=== Testes concluídos ===");
