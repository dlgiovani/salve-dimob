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

export async function testeVaiEVolta(path_dimob: string) {
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
