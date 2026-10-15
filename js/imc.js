/**
 * Regras da calculadora de IMC (lógica pura, sem DOM).
 * Origem: calculadoraIMC de carlosdanielramosleandro43-ctrl, com as 6 faixas corretas.
 */

const IMC_LIMITE_ABAIXO_DO_PESO = 18.5;
const IMC_LIMITE_PESO_NORMAL = 25;
const IMC_LIMITE_SOBREPESO = 30;
const IMC_LIMITE_OBESIDADE_I = 35;
const IMC_LIMITE_OBESIDADE_II = 40;

/** Faixas em ordem crescente: o primeiro limite que o IMC não alcança define a classe. */
const FAIXAS_IMC = [
  { limite: IMC_LIMITE_ABAIXO_DO_PESO, rotulo: 'Abaixo do peso' },
  { limite: IMC_LIMITE_PESO_NORMAL, rotulo: 'Peso normal' },
  { limite: IMC_LIMITE_SOBREPESO, rotulo: 'Sobrepeso' },
  { limite: IMC_LIMITE_OBESIDADE_I, rotulo: 'Obesidade grau I' },
  { limite: IMC_LIMITE_OBESIDADE_II, rotulo: 'Obesidade grau II' },
];
const ROTULO_ACIMA_DAS_FAIXAS = 'Obesidade grau III';

/**
 * Calcula o índice de massa corporal.
 * @param {number} peso - Peso em quilos.
 * @param {number} altura - Altura em metros.
 * @returns {number|null} IMC, ou null se peso ou altura não forem números positivos.
 */
function calcularImc(peso, altura) {
  const valoresValidos = Number.isFinite(peso) && Number.isFinite(altura);
  if (!valoresValidos) return null;
  if (peso <= 0 || altura <= 0) return null;

  return peso / (altura * altura);
}

/**
 * Classifica um IMC em uma das 6 faixas.
 * @param {number|null} imc - Valor do IMC.
 * @returns {string|null} Nome da faixa, ou null se o IMC for inválido.
 */
function classificarImc(imc) {
  if (imc === null || !Number.isFinite(imc)) return null;

  const faixa = FAIXAS_IMC.find((item) => imc < item.limite);
  return faixa ? faixa.rotulo : ROTULO_ACIMA_DAS_FAIXAS;
}

/* Permite importar as funções nos testes (Node); no navegador não existe `module`. */
if (typeof module !== 'undefined') {
  module.exports = {
    IMC_LIMITE_ABAIXO_DO_PESO,
    IMC_LIMITE_PESO_NORMAL,
    IMC_LIMITE_SOBREPESO,
    IMC_LIMITE_OBESIDADE_I,
    IMC_LIMITE_OBESIDADE_II,
    calcularImc,
    classificarImc,
  };
}
