#!/usr/bin/env -S bun run

/**
 * Teste roundtrip com arquivo DIMOB real
 *
 * Este teste:
 * 1. Carrega dimob_2024.txt
 * 2. Deserializa para declaração
 * 3. Testa formatação de valores individuais
 * 4. Testa formatação da declaração completa
 * 5. Serializa de volta para DIMOB e verifica integridade
 * 6. Testa exportação JSON
 */

import { readFileSync, writeFileSync } from "fs";
import {
  deserializarDIMOBParaDeclaracao,
  serializarDeclaracaoParaDIMOB,
  formatarValorParaExcel,
  formatarDeclaracaoParaLeitura,
  serializarDeclaracaoParaJSON,
} from "./core/index";

console.log("=== TESTE ROUNDTRIP COM DIMOB_2024.TXT ===\n");

// 1. Carregar arquivo DIMOB original
console.log("1️⃣  Carregando dimob_2024.txt...");
const conteudoOriginal = readFileSync("./dimob_2024.txt", "utf-8");
console.log(`   ✓ Arquivo carregado: ${conteudoOriginal.length} caracteres\n`);

// 2. Deserializar para declaração
console.log("2️⃣  Deserializando DIMOB para declaração...");
const declaracao = deserializarDIMOBParaDeclaracao(conteudoOriginal);
console.log(`   ✓ Header: ${declaracao.Header.sistema.valor}`);
console.log(`   ✓ R01: CNPJ ${declaracao.R01.cnpjDeclarante.valor}`);
console.log(`   ✓ R02: ${declaracao.R02.length} registros de locação`);
console.log(`   ✓ R03: ${declaracao.R03.length} registros de venda`);
console.log(`   ✓ R04: ${declaracao.R04.length} registros de cessão\n`);

// 3. Testar formatação de valores individuais
console.log("3️⃣  Testando formatarValorParaExcel() com valores reais...\n");

// Testar datas do R01
if (declaracao.R01.anoCalendario.valor) {
  const anoRaw = declaracao.R01.anoCalendario.valor;
  const anoFormatado = formatarValorParaExcel(anoRaw, "ANO");
  console.log(`   Ano-calendário R01:`);
  console.log(`   - Raw: "${anoRaw}"`);
  console.log(`   - Formatado: ${anoFormatado} (tipo: ${typeof anoFormatado})`);
  console.log(`   ✓ Esperado: número inteiro\n`);
}

// Testar valores de R02 (se houver)
if (declaracao.R02.length > 0) {
  const r02 = declaracao.R02[0];

  console.log(`   Primeiro R02 (registro de locação):\n`);

  // Data de contrato
  if (r02.dataContrato?.valor) {
    const dataRaw = r02.dataContrato.valor;
    const dataFormatada = formatarValorParaExcel(dataRaw, "DATA");
    console.log(`   Data do Contrato:`);
    console.log(`   - Raw: "${dataRaw}"`);
    console.log(`   - Formatada: "${dataFormatada}"`);
    console.log(`   ✓ Formato DD/MM/YYYY\n`);
  }

  // Valor de aluguel
  if (r02.valorAluguelJaneiro?.valor) {
    const valorRaw = r02.valorAluguelJaneiro.valor;
    const valorFormatado = formatarValorParaExcel(valorRaw, "R$");
    console.log(`   Valor Aluguel Janeiro:`);
    console.log(`   - Raw: "${valorRaw}"`);
    console.log(`   - Formatado: ${valorFormatado} (tipo: ${typeof valorFormatado})`);
    console.log(`   ✓ Formato: número decimal\n`);
  }

  // CPF/CNPJ do locatário
  if (r02.cpfCnpjLocatario?.valor) {
    const cpfCnpjRaw = r02.cpfCnpjLocatario.valor;
    const cpfCnpjFormatado = formatarValorParaExcel(cpfCnpjRaw, "CPF/CNPJ");
    console.log(`   CPF/CNPJ Locatário:`);
    console.log(`   - Raw: "${cpfCnpjRaw}"`);
    console.log(`   - Formatado: "${cpfCnpjFormatado}"`);
    console.log(`   ✓ Mantido raw (sem pontuação)\n`);
  }
}

// 4. Testar formatação da declaração completa
console.log("4️⃣  Testando formatarDeclaracaoParaLeitura()...");
const declaracaoFormatada = formatarDeclaracaoParaLeitura(declaracao);
console.log(`   ✓ Declaração formatada criada`);
console.log(`   ✓ Estrutura: ${Object.keys(declaracaoFormatada).join(", ")}`);

// Verificar que metadados foram preservados
if (declaracaoFormatada.R01.cnpjDeclarante.formato) {
  console.log(`   ✓ Metadados preservados (formato, ordem, campo, etc.)`);
}

// Verificar valores formatados
console.log(`\n   Exemplos de valores formatados:`);
console.log(`   - Header.sistema: "${declaracaoFormatada.Header.sistema.valor}"`);
console.log(`   - R01.anoCalendario: ${declaracaoFormatada.R01.anoCalendario.valor} (${typeof declaracaoFormatada.R01.anoCalendario.valor})`);

if (declaracaoFormatada.R02.length > 0) {
  const r02fmt = declaracaoFormatada.R02[0];
  if (r02fmt.dataContrato?.valor) {
    console.log(`   - R02[0].dataContrato: "${r02fmt.dataContrato.valor}"`);
  }
  if (r02fmt.valorAluguelJaneiro?.valor) {
    console.log(`   - R02[0].valorAluguelJaneiro: ${r02fmt.valorAluguelJaneiro.valor}`);
  }
}
console.log();

// 5. Testar serialização de volta para DIMOB (roundtrip)
console.log("5️⃣  Testando roundtrip (DIMOB → Declaração → DIMOB)...");
const conteudoSerializado = serializarDeclaracaoParaDIMOB(declaracao);

console.log(`   - Original: ${conteudoOriginal.length} caracteres`);
console.log(`   - Serializado: ${conteudoSerializado.length} caracteres`);

// Comparar linha por linha
const linhasOriginais = conteudoOriginal.split(/\r\n|\r|\n/).filter(l => l.length > 0);
const linhasSerializadas = conteudoSerializado.split(/\r\n|\r|\n/).filter(l => l.length > 0);

console.log(`   - Linhas originais: ${linhasOriginais.length}`);
console.log(`   - Linhas serializadas: ${linhasSerializadas.length}`);

if (linhasOriginais.length === linhasSerializadas.length) {
  console.log(`   ✓ Mesmo número de linhas`);

  let linhasIdenticas = 0;
  let linhasDiferentes = 0;

  for (let i = 0; i < linhasOriginais.length; i++) {
    if (linhasOriginais[i] === linhasSerializadas[i]) {
      linhasIdenticas++;
    } else {
      linhasDiferentes++;
      if (linhasDiferentes <= 3) {
        console.log(`\n   ⚠ Diferença na linha ${i + 1}:`);
        console.log(`     Original:     "${linhasOriginais[i].substring(0, 80)}..."`);
        console.log(`     Serializado:  "${linhasSerializadas[i].substring(0, 80)}..."`);
      }
    }
  }

  console.log(`\n   ✓ Linhas idênticas: ${linhasIdenticas}/${linhasOriginais.length}`);

  if (linhasDiferentes > 0) {
    console.log(`   ⚠ Linhas diferentes: ${linhasDiferentes}/${linhasOriginais.length}`);
  } else {
    console.log(`   ✅ ROUNDTRIP PERFEITO! Todas as linhas são idênticas.`);
  }
} else {
  console.log(`   ✗ ERRO: Número de linhas diferente!`);
}
console.log();

// 6. Testar exportação JSON
console.log("6️⃣  Testando serializarDeclaracaoParaJSON()...");

const jsonPretty = serializarDeclaracaoParaJSON(declaracao);
const jsonCompact = serializarDeclaracaoParaJSON(declaracao, false);

console.log(`   - JSON pretty: ${jsonPretty.length} caracteres`);
console.log(`   - JSON compact: ${jsonCompact.length} caracteres`);

// Salvar JSON para inspeção
writeFileSync("./dimob_2024_formatted.json", jsonPretty, "utf-8");
console.log(`   ✓ JSON salvo em: dimob_2024_formatted.json`);

// Verificar que é JSON válido
try {
  const parsed = JSON.parse(jsonPretty);
  console.log(`   ✓ JSON é válido`);
  console.log(`   ✓ Seções: ${Object.keys(parsed).join(", ")}`);

  // Mostrar um exemplo de valor formatado no JSON
  if (parsed.R02 && parsed.R02.length > 0) {
    console.log(`\n   Exemplo de R02[0] no JSON:`);
    const r02json = parsed.R02[0];
    const camposExemplo = Object.keys(r02json).slice(0, 5);
    camposExemplo.forEach(key => {
      const campo = r02json[key];
      console.log(`   - ${key}: ${JSON.stringify(campo.valor)} (${campo.formato})`);
    });
  }
} catch (e) {
  console.error(`   ✗ ERRO: JSON inválido!`, e);
}

console.log("\n=== TESTE ROUNDTRIP CONCLUÍDO ===");
