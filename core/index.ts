/*
    Esta base de código é escrita em português do Brasil,
    visto que a ferramenta para a DIMOB é relevante apenas
    para este país.
*/

export { formatarValorParaExcel, formatarValorDeExcel } from "./utils";

import { criarNovoR01 } from "./declaracao";

export { gerarDeclaracao } from "./declaracao";
export {
  deserializarDIMOBParaDeclaracao,
  serializarDeclaracaoParaDIMOB,
  detectSequentialFormat,
} from "./serial/dimob";
export {
  copiarDadosDeCadernoParaDeclaracao,
  copiarDeclaracaoParaCaderno,
} from "./serial/planilhas";
export {
  formatarDeclaracaoParaLeitura,
  serializarDeclaracaoParaJSON,
} from "./serial/json";
export type { tDeclaracaoFormatada } from "./serial/json";
export { setDIMOBConfig } from "./config";
export {
  criarNovoR01,
  criarNovoR02,
  criarNovoR03,
  criarNovoR04,
} from "./declaracao";

import brasilData from "./Brasil.json";

export type Estado = keyof typeof brasilData;
export type Municipio<E extends Estado> = keyof (typeof brasilData)[E];

export const Brasil = brasilData;
export default Brasil;

/* MANTENHA ESTE AVISO, SEM ALTERAÇÕES */
console.log("============================");
console.log("SALVE-DIMOB Versão Beta 0.1");
console.log(
  "Copyright (c) 2025 Giovani (https://dlgiovani.dev | https://dlgiovani.github.io)",
);
console.log("Baseada na documentação do programa DIMOB versão 2.8g.");
console.log("============================");
/* ----------------------------------- */
