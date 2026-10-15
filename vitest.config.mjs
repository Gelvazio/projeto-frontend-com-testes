/**
 * Configuração do Vitest (Aula 03).
 * .mjs porque o package.json desta pasta é CommonJS (código ES6 sem módulos) e este arquivo
 * usa import/export.
 *
 * - Cobertura (--coverage): mede todos os js/**\/*.js, inclusive os módulos ainda sem teste
 *   (aparecem com 0% para mostrar o que falta testar). Saída em coverage/index.html.
 * - Relatório dos testes em HTML: só no modo "relatorio" (npm run test:report). singleFile gera
 *   um index.html único, que abre direto no navegador, sem servidor.
 */
import { defineConfig } from 'vitest/config';

const MODO_RELATORIO = 'relatorio';
const PASTA_RELATORIO_HTML = 'html';
const PASTA_COBERTURA = 'coverage';
const ARQUIVOS_MEDIDOS = ['js/**/*.js'];

/**
 * Escolhe os reporters do terminal e, no modo relatório, também o HTML.
 * @param {string} modo - Valor de --mode passado ao Vitest.
 * @returns {Array<string|Array>} Lista de reporters do Vitest.
 */
function escolherReporters(modo) {
  if (modo !== MODO_RELATORIO) return ['default'];

  return ['default', ['html', { outputDir: PASTA_RELATORIO_HTML, singleFile: true }]];
}

export default defineConfig(({ mode }) => ({
  test: {
    reporters: escolherReporters(mode),
    coverage: {
      provider: 'v8',
      include: ARQUIVOS_MEDIDOS,
      reportsDirectory: PASTA_COBERTURA,
    },
  },
}));
