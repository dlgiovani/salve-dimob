import ExcelJS from "exceljs";
import fs from "fs";
import { definicaoDeclaracao } from "./constantes";
import { gerarDeclaracao } from "./declaracao";
import {
  deserializarDIMOBParaDeclaracao,
  serializarDeclaracaoParaDIMOB,
} from "./serial/dimob";
import {
  copiarDadosDeCadernoParaDeclaracao,
  copiarDeclaracaoParaCaderno,
} from "./serial/planilhas";

export async function testeVaiEVoltaDimob(path_dimob: string) {
  console.log("\n=== TESTE DE ROUND-TRIP ===\n");

  console.log("1. Lendo arquivo DIMOB original...");
  const dimobOriginal = fs.readFileSync(path_dimob, "utf-8");
  const linhasDimobOriginal = dimobOriginal
    .split(/\r\n|\r|\n/)
    .filter((l) => l.length > 0);

  console.log("2. Convertendo DIMOB → declaracao...");
  const declaracao1 = deserializarDIMOBParaDeclaracao(dimobOriginal);
  console.log(`   - R02: ${declaracao1.R02.length} registros`);
  console.log(`   - R03: ${declaracao1.R03.length} registros`);
  console.log(`   - R04: ${declaracao1.R04.length} registros`);
  const totalRegistrosOriginal =
    declaracao1.R02.length + declaracao1.R03.length + declaracao1.R04.length;

  console.log("\n3. Exportando declaracao → Excel (teste-roundtrip.xlsx)...");
  const workbook = copiarDeclaracaoParaCaderno(declaracao1);
  await workbook.xlsx.writeFile("./teste-roundtrip.xlsx");

  console.log("4. Importando Excel → declaracao...");
  const workbook2 = new ExcelJS.Workbook();
  await workbook2.xlsx.readFile("./teste-roundtrip.xlsx");
  const declaracao2 = gerarDeclaracao();
  copiarDadosDeCadernoParaDeclaracao(workbook2, declaracao2);
  console.log(`   - R02: ${declaracao2.R02.length} registros`);
  console.log(`   - R03: ${declaracao2.R03.length} registros`);
  console.log(`   - R04: ${declaracao2.R04.length} registros`);
  const totalRegistrosExcel =
    declaracao2.R02.length + declaracao2.R03.length + declaracao2.R04.length;

  console.log("\n5. Exportando declaracao → DIMOB (dimob_novo.txt)...");
  const dimobNovo = serializarDeclaracaoParaDIMOB(declaracao2);
  fs.writeFileSync("./dimob_novo.txt", dimobNovo);
  const linhasDimobNovo = dimobNovo
    .split(/\r\n|\r|\n/)
    .filter((l) => l.length > 0);

  console.log("\n=== COMPARAÇÃO ===");
  console.log(`Total de registros (R02+R03+R04):`);
  console.log(`  Original: ${totalRegistrosOriginal}`);
  console.log(`  Excel:    ${totalRegistrosExcel}`);
  console.log(
    `  Novo:     ${declaracao2.R02.length + declaracao2.R03.length + declaracao2.R04.length}`,
  );

  console.log(`\nTotal de linhas:`);
  console.log(`  Original: ${linhasDimobOriginal.length}`);
  console.log(`  Novo:     ${linhasDimobNovo.length}`);

  console.log("\n=== VALIDAÇÃO ===");
  const registrosIguais = totalRegistrosOriginal === totalRegistrosExcel;
  const linhasIguais = linhasDimobOriginal.length === linhasDimobNovo.length;

  const normalizarEOL = (texto: string) => texto.replace(/\r\n|\r|\n/g, "\n");
  const conteudoIdentico =
    normalizarEOL(dimobOriginal.trim()) === normalizarEOL(dimobNovo.trim());

  console.log(
    `✓ Número de registros preservado: ${registrosIguais ? "SIM" : "NÃO"}`,
  );
  console.log(`✓ Número de linhas preservado: ${linhasIguais ? "SIM" : "NÃO"}`);
  console.log(
    `✓ Conteúdo idêntico (normalizado): ${conteudoIdentico ? "SIM" : "NÃO"}`,
  );

  if (!conteudoIdentico) {
    console.log("\nDIFERENÇAS ENCONTRADAS");
    console.log("Comparando linha por linha...");
    for (
      let i = 0;
      i < Math.max(linhasDimobOriginal.length, linhasDimobNovo.length);
      i++
    ) {
      if (linhasDimobOriginal[i] !== linhasDimobNovo[i]) {
        console.log(`\nLinha ${i + 1} difere:`);
        console.log(
          `  Original: ${linhasDimobOriginal[i]?.substring(0, 80)}...`,
        );
        console.log(`  Novo:     ${linhasDimobNovo[i]?.substring(0, 80)}...`);
        if (i < 5) continue;
        else {
          console.log("  (mostrando apenas as primeiras diferenças)");
          break;
        }
      }
    }
  }

  console.log("\n=== TESTE CONCLUÍDO ===\n");
}

export async function testeVaiEVoltaExcel(path_xlsx: string) {
  console.log("\n=== TESTE DE ROUND-TRIP COMPLETO (XLSX → DIMOB → XLSX) ===\n");

  console.log("1. Lendo arquivo Excel original...");
  const workbook1 = new ExcelJS.Workbook();
  await workbook1.xlsx.readFile(path_xlsx);

  console.log("2. Importando Excel → declaracao1...");
  const declaracao1 = gerarDeclaracao();
  copiarDadosDeCadernoParaDeclaracao(workbook1, declaracao1);
  console.log(`   - R02: ${declaracao1.R02.length} registros`);
  console.log(`   - R03: ${declaracao1.R03.length} registros`);
  console.log(`   - R04: ${declaracao1.R04.length} registros`);
  const totalRegistros1 =
    declaracao1.R02.length + declaracao1.R03.length + declaracao1.R04.length;

  console.log("\n3. Exportando declaracao1 → DIMOB (temp-roundtrip.txt)...");
  const dimobTexto = serializarDeclaracaoParaDIMOB(declaracao1);
  fs.writeFileSync("./temp-roundtrip.txt", dimobTexto);
  const linhasDimob = dimobTexto
    .split(/\r\n|\r|\n/)
    .filter((l) => l.length > 0);
  console.log(`   - Total de linhas no DIMOB: ${linhasDimob.length}`);

  console.log("\n4. Importando DIMOB → declaracao2...");
  const declaracao2 = deserializarDIMOBParaDeclaracao(dimobTexto);
  console.log(`   - R02: ${declaracao2.R02.length} registros`);
  console.log(`   - R03: ${declaracao2.R03.length} registros`);
  console.log(`   - R04: ${declaracao2.R04.length} registros`);
  const totalRegistros2 =
    declaracao2.R02.length + declaracao2.R03.length + declaracao2.R04.length;

  console.log(
    "\n5. Exportando declaracao2 → Excel (temp-roundtrip-final.xlsx)...",
  );
  const workbook2 = copiarDeclaracaoParaCaderno(declaracao2);
  await workbook2.xlsx.writeFile("./temp-roundtrip-final.xlsx");

  console.log("\n6. Lendo Excel final para comparação...");
  const workbook3 = new ExcelJS.Workbook();
  await workbook3.xlsx.readFile("./temp-roundtrip-final.xlsx");

  console.log("\n=== COMPARAÇÃO DE REGISTROS ===");
  console.log(`Total de registros (R02+R03+R04):`);
  console.log(`  Excel Original: ${totalRegistros1}`);
  console.log(`  DIMOB:          ${totalRegistros2}`);
  console.log(
    `  Excel Final:    ${declaracao2.R02.length + declaracao2.R03.length + declaracao2.R04.length}`,
  );

  console.log("\n=== COMPARAÇÃO DE PLANILHAS ===");
  let diferencasEncontradas = false;

  workbook1.eachSheet((sheet1, sheetId) => {
    const sheet2 = workbook3.getWorksheet(sheet1.name);
    if (!sheet2) {
      console.log(`❌ Planilha "${sheet1.name}" não encontrada no Excel final`);
      diferencasEncontradas = true;
      return;
    }

    const rows1 = sheet1.getSheetValues();
    const rows2 = sheet2.getSheetValues();

    if (!rows1 || !rows2) return;

    const maxRows = Math.max(rows1.length, rows2.length);
    let diferencasNaPlanilha = 0;

    for (let i = 1; i < maxRows; i++) {
      const row1 = rows1[i];
      const row2 = rows2[i];

      if (!row1 || !row2) {
        if (row1 !== row2) {
          diferencasNaPlanilha++;
          console.log(
            `   Linha ${i} em "${sheet1.name}": uma planilha tem linha vazia`,
          );
        }
        continue;
      }

      if (!Array.isArray(row1) || !Array.isArray(row2)) continue;

      const maxCols = Math.max(row1.length, row2.length);
      for (let j = 1; j < maxCols; j++) {
        const val1 = row1[j];
        const val2 = row2[j];

        const normalizado1 = normalizarValorExcel(val1);
        const normalizado2 = normalizarValorExcel(val2);

        if (normalizado1 !== normalizado2) {
          diferencasNaPlanilha++;
          console.log(
            `   Diferença em "${sheet1.name}" linha ${i}, coluna ${j}:`,
          );
          console.log(`     Original: ${normalizado1}`);
          console.log(`     Final:    ${normalizado2}`);
        }
      }
    }

    if (diferencasNaPlanilha === 0) {
      console.log(`✓ Planilha "${sheet1.name}": IDÊNTICA`);
    } else {
      console.log(
        `❌ Planilha "${sheet1.name}": ${diferencasNaPlanilha} diferença(s)`,
      );
      diferencasEncontradas = true;
    }
  });

  console.log("\n=== VALIDAÇÃO FINAL ===");
  const registrosPreservados = totalRegistros1 === totalRegistros2;
  console.log(
    `✓ Número de registros preservado: ${registrosPreservados ? "SIM" : "NÃO"}`,
  );
  console.log(
    `✓ Conteúdo das planilhas: ${!diferencasEncontradas ? "IDÊNTICO" : "COM DIFERENÇAS"}`,
  );

  console.log("\n=== TESTE CONCLUÍDO ===\n");
}

function normalizarValorExcel(valor: any): string {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "number") return valor.toString();
  if (valor instanceof Date) {
    return valor.toISOString().split("T")[0] as string;
  }
  return String(valor).trim();
}

export async function ChecarColunasArquivoExcel(path: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);

  const r02Sheet = workbook.getWorksheet("R02 - Locação");
  if (!r02Sheet) return;

  const header = r02Sheet.getRow(1).values as any[];
  const dataRow = r02Sheet.getRow(2).values as any[];

  console.log("\n=== Excel Columns ===");
  for (let i = 1; i <= 7; i++) {
    console.log(`Col ${i}: "${header[i]}" = "${dataRow[i]}"`);
  }

  console.log("\n=== Expected field order from definicaoDeclaracao.R02 ===");
  const r02Def = definicaoDeclaracao.R02;
  const campos = Object.entries(r02Def);
  campos.sort(
    ([, a]: any, [, b]: any) => parseInt(a.ordem) - parseInt(b.ordem),
  );

  campos.slice(0, 7).forEach(([key, campo]: any, idx) => {
    const valorFixo = campo.valor || "none";
    console.log(
      `Ordem ${campo.ordem}: ${campo.campo} (valor fixo: ${valorFixo}, should be in Excel: ${!campo.valor})`,
    );
  });
}
