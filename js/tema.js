/**
 * Regras do tema claro/escuro (lógica pura, sem DOM).
 * Origem: darkmode de carlosdanielramosleandro43-ctrl e marcosxz447l.
 */

const TEMA_CLARO = 'claro';
const TEMA_ESCURO = 'escuro';
const ROTULO_IR_PARA_CLARO = 'Light Mode';
const ROTULO_IR_PARA_ESCURO = 'Dark Mode';

/**
 * Alterna entre o tema claro e o escuro.
 * @param {string} temaAtual - claro ou escuro.
 * @returns {string} O tema oposto.
 */
function alternarTema(temaAtual) {
  return temaAtual === TEMA_ESCURO ? TEMA_CLARO : TEMA_ESCURO;
}

/**
 * Devolve o texto do botão que leva ao outro tema.
 * @param {string} temaAtual - claro ou escuro.
 * @returns {string} "Light Mode" quando está escuro, "Dark Mode" quando está claro.
 */
function rotuloBotaoTema(temaAtual) {
  return temaAtual === TEMA_ESCURO ? ROTULO_IR_PARA_CLARO : ROTULO_IR_PARA_ESCURO;
}

/* Permite importar as funções nos testes (Node); no navegador não existe `module`. */
if (typeof module !== 'undefined') {
  module.exports = {
    TEMA_CLARO,
    TEMA_ESCURO,
    ROTULO_IR_PARA_CLARO,
    ROTULO_IR_PARA_ESCURO,
    alternarTema,
    rotuloBotaoTema,
  };
}
