import { FORMATOS } from './core/dist/constantes.js';
import { gerarDeclaracao, criarNovoR02 } from './core/dist/declaracao.js';
import { serializarDeclaracaoParaDIMOB } from './core/dist/serial/dimob.js';

console.log('=== FORMATOS.EOL ===');
console.log('Value:', JSON.stringify(FORMATOS.EOL));
console.log('Length:', FORMATOS.EOL.length);
console.log('Hex:', Array.from(FORMATOS.EOL).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));

const decl = gerarDeclaracao();
const r02 = criarNovoR02();

console.log('\n=== Header delimitador ===');
console.log('Value:', JSON.stringify(decl.Header.delimitador.valor));
console.log('Length:', decl.Header.delimitador.valor.length);
console.log('Tamanho:', decl.Header.delimitador.tamanho);

console.log('\n=== R01 delimitador ===');
console.log('Value:', JSON.stringify(decl.R01.delimitador.valor));
console.log('Length:', decl.R01.delimitador.valor.length);
console.log('Tamanho:', decl.R01.delimitador.tamanho);

console.log('\n=== R02 delimitador ===');
console.log('Value:', JSON.stringify(r02.delimitador.valor));
console.log('Length:', r02.delimitador.valor.length);
console.log('Tamanho:', r02.delimitador.tamanho);

// Add one R02 to test
decl.R02.push(r02);

console.log('\n=== Serializing ===');
const output = serializarDeclaracaoParaDIMOB(decl);
console.log('Output length:', output.length);
console.log('First 200 chars:', output.substring(0, 200));

// Check for line breaks
const lines = output.split('\n');
console.log('\n=== Line count ===');
console.log('Split by \\n:', lines.length);
console.log('Line 1 length:', lines[0]?.length);
console.log('Line 2 length:', lines[1]?.length);

// Check hex of first line ending
const firstLineEnd = output.substring(370, 380);
console.log('\n=== First line ending (chars 370-380) ===');
console.log('Text:', JSON.stringify(firstLineEnd));
console.log('Hex:', Array.from(firstLineEnd).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
