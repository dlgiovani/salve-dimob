/*
    Esta base de código é escrita em português do Brasil,
    visto que a ferramenta para a DIMOB é relevante apenas
    para este país.
*/

export { gerarDeclaracao } from "./declaracao";
export {
  deserializarDIMOBParaDeclaracao,
  serializarDeclaracaoParaDIMOB,
} from "./serial/dimob";
export {
  copiarDadosDeCadernoParaDeclaracao,
  copiarDeclaracaoParaCaderno,
} from "./serial/planilhas";

/* MANTENHA ESTE AVISO, SEM ALTERAÇÕES */
console.log("============================");
console.log("SALVE-DIMOB Versão Beta 0.1");
console.log(
  "Copyright (c) 2025 Giovani (https://dlgiovani.dev | https://dlgiovani.github.io)",
);
console.log("Baseada na documentação do programa DIMOB versão 2.8g.");
console.log("============================");
/* ----------------------------------- */
