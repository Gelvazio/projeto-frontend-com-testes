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

/* ==========================================================================================
 * TEST.3 — it(descricao, fn) e test(descricao, fn), com BDD Given/When/Then  (slides 6 e 14)
 *
 * it declara UM caso de teste. test é exatamente a mesma função com outro nome: use o que
 * ler melhor. "it" combina com frases ("it calculates..." = "ele calcula...").
 * Cada caso BDD vira um it:
 *   Given (dado)   -> o estado inicial: os valores de entrada;
 *   When (quando)  -> a ação: chamar a função;
 *   Then (então)   -> o resultado esperado e mensurável: o expect.
 * ======================================================================================== */
describe('calcularImc — casos BDD com it e test', () => {
  it('dado 100 kg e 2 m, quando calcula o IMC, então o resultado é 25', () => {
    // Given
    const peso = 100;
    const altura = 2;
    // When
    const imc = calcularImc(peso, altura);
    // Then
    expect(imc).toBe(25);
  });

  test('dado 80 kg e 2 m, quando calcula o IMC, então o resultado é 20 (test = it)', () => {
    expect(calcularImc(80, 2)).toBe(20);
  });
});

/* ==========================================================================================
 * TEST.4 — expect(valor): a asserção  (slide 15)
 *
 * expect "embrulha" o valor obtido e oferece os matchers (toBe, toEqual...). É o veredito:
 *   - condição atendida  -> teste verde (passou);
 *   - condição diferente -> o Vitest para o caso e mostra o diff no terminal, por exemplo:
 *       Expected: 25
 *       Received: 24.9
 * .not inverte qualquer matcher. expect.assertions(n) exige que n asserções rodem: protege
 * contra o teste "verde" que não conferiu nada (teste sem expect = falsa segurança).
 * ======================================================================================== */
describe('calcularImc — expect', () => {
  it('confere o resultado com expect e com .not', () => {
    expect.assertions(2);

    const imc = calcularImc(100, 2);

    expect(imc).toBe(25);
    expect(imc).not.toBe(24.9);
  });
});

/* ==========================================================================================
 * TEST.5 — Padrão AAA: Arrange, Act, Assert  (slides 16 a 19)
 *
 * Organiza o raciocínio de TODO teste em 3 fases, sempre nesta ordem:
 *   1. Arrange (preparar): dados de entrada, variáveis e mocks;
 *   2. Act (agir): chamar a função testada — de preferência em UMA linha;
 *   3. Assert (validar): conferir o retorno com expect.
 * Separar as fases com comentário ou linha em branco deixa o teste autoexplicativo.
 * (No slide 18, a etapa "liberar instâncias e registrar cobertura" vem depois, fora do AAA.)
 * ======================================================================================== */
describe('calcularImc — padrão AAA', () => {
  it('calcula o IMC de 90 kg e 1,5 m', () => {
    // Arrange
    const peso = 90;
    const altura = 1.5;

    // Act
    const imc = calcularImc(peso, altura);

    // Assert
    expect(imc).toBe(40);
  });

  it('devolve null quando a altura é zero (evita divisão por zero)', () => {
    // Arrange
    const peso = 70;
    const altura = 0;

    // Act
    const imc = calcularImc(peso, altura);

    // Assert
    expect(imc).toBe(null);
  });
});

/* ==========================================================================================
 * TEST.6 — toBe(): igualdade estrita  (slide 20)
 *
 * toBe compara como o operador === : mesmo valor e mesmo tipo. Ideal para PRIMITIVOS:
 * números, textos (strings) e booleanos. Para objetos e arrays, use toEqual (TEST.11).
 * ======================================================================================== */
describe('classificarImc — toBe', () => {
  it('classifica IMC 17 como "Abaixo do peso" (texto é primitivo)', () => {
    const faixa = classificarImc(17);

    expect(faixa).toBe('Abaixo do peso');
  });

  it('calcula exatamente 25 para 100 kg e 2 m (número exato)', () => {
    const imc = calcularImc(100, 2);

    expect(imc).toBe(25);
  });

  it('o limite de uma faixa pertence à faixa de cima: 25 já é "Sobrepeso"', () => {
    expect(classificarImc(25)).toBe('Sobrepeso');
  });
});

/* ==========================================================================================
 * TEST.7 — toBeCloseTo(): números decimais
 *
 * O computador guarda decimais de forma aproximada: 0.1 + 0.2 dá 0.30000000000000004.
 * Por isso toBe falha com decimais "quebrados". toBeCloseTo(esperado, casas) aceita uma
 * diferença mínima; o 2º argumento diz quantas casas decimais precisam bater (padrão: 2).
 * ======================================================================================== */
describe('calcularImc — toBeCloseTo', () => {
  it('mostra por que toBe não serve para decimais', () => {
    const soma = 0.1 + 0.2;

    expect(soma).not.toBe(0.3);
    expect(soma).toBeCloseTo(0.3);
  });

  it('calcula ~22,86 para 70 kg e 1,75 m', () => {
    const imc = calcularImc(70, 1.75);

    expect(imc).toBeCloseTo(22.86, 2);
  });
});
