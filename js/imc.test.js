/**
 * Testes unitários de imc.js com Vitest — Aula 03 (AULA-03-SLIDES.md).
 *
 * Cada bloco abaixo ensina UM conceito da aula (tarefa TEST do quadro, uma subtarefa por
 * conceito). Rodar: npm test (watch) ou npm run test:run (uma vez).
 * Convenção (slide 13): o teste fica ao lado do código, com o sufixo .test.js.
 */
import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  IMC_LIMITE_ABAIXO_DO_PESO,
  IMC_LIMITE_PESO_NORMAL,
  IMC_LIMITE_SOBREPESO,
  IMC_LIMITE_OBESIDADE_I,
  IMC_LIMITE_OBESIDADE_II,
  calcularImc,
  classificarImc,
} from './imc.js';

/* ==========================================================================================
 * TEST.2 — describe(titulo, fn)  (slide 14)
 *
 * describe AGRUPA testes que falam da mesma coisa: cria uma "suite". O título aparece no
 * relatório do terminal e ajuda a achar o teste que falhou. Pode haver describe dentro de
 * describe para subdividir (ex.: "casos válidos" e "casos inválidos").
 * it.todo registra um caso PLANEJADO: aparece no relatório como "todo" e não falha.
 * ======================================================================================== */
describe('calcularImc', () => {
  describe('casos válidos', () => {
    it.todo('calcula peso / (altura * altura)');
  });

  describe('casos inválidos', () => {
    it.todo('devolve null para peso ou altura zero, negativos ou não numéricos');
  });
});

describe('classificarImc', () => {
  it.todo('devolve o nome de uma das 6 faixas');
});
