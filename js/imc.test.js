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

/* ==========================================================================================
 * TEST.8 — toBeNull(): "sem resultado"  (slide 22)
 *
 * toBeNull confere se o valor é exatamente null. As funções do IMC devolvem null quando a
 * entrada não permite calcular: é o caso de borda pedido no slide 29 (nulos, zero, inválidos).
 * ======================================================================================== */
describe('calcularImc e classificarImc — toBeNull', () => {
  it('devolve null para peso zero', () => {
    expect(calcularImc(0, 1.75)).toBeNull();
  });

  it('devolve null para peso ou altura negativos', () => {
    expect(calcularImc(-70, 1.75)).toBeNull();
    expect(calcularImc(70, -1.75)).toBeNull();
  });

  it('devolve null para valores que não são números finitos', () => {
    expect(calcularImc(NaN, 1.75)).toBeNull();
    expect(calcularImc(70, Infinity)).toBeNull();
    expect(calcularImc('70', 1.75)).toBeNull();
  });

  it('classificarImc devolve null para IMC null ou NaN', () => {
    expect(classificarImc(null)).toBeNull();
    expect(classificarImc(NaN)).toBeNull();
  });
});

/* ==========================================================================================
 * TEST.9 — toBeDefined(): o valor existe  (slide 22)
 *
 * toBeDefined confere que o valor NÃO é undefined (a variável foi inicializada). Útil para
 * garantir que algo foi exportado ou devolvido. Atenção: null passa em toBeDefined — para
 * barrar null também, combine com .not.toBeNull().
 * ======================================================================================== */
describe('imc.js — toBeDefined', () => {
  it('exporta as constantes de limite das faixas', () => {
    expect(IMC_LIMITE_ABAIXO_DO_PESO).toBeDefined();
    expect(IMC_LIMITE_PESO_NORMAL).toBeDefined();
    expect(IMC_LIMITE_SOBREPESO).toBeDefined();
    expect(IMC_LIMITE_OBESIDADE_I).toBeDefined();
    expect(IMC_LIMITE_OBESIDADE_II).toBeDefined();
  });

  it('classificarImc devolve um valor definido e não nulo para um IMC válido', () => {
    const faixa = classificarImc(22);

    expect(faixa).toBeDefined();
    expect(faixa).not.toBeNull();
  });
});

/* ==========================================================================================
 * TEST.10 — toBeGreaterThan(): comparação numérica  (slide 22)
 *
 * toBeGreaterThan(n) confere valor > n. A família também tem toBeGreaterThanOrEqual,
 * toBeLessThan e toBeLessThanOrEqual. Úteis para limites mínimos e máximos.
 * ======================================================================================== */
describe('imc.js — toBeGreaterThan', () => {
  it('120 kg e 1,70 m dá IMC (~41,5) acima do limite da obesidade grau II', () => {
    const imc = calcularImc(120, 1.7);

    expect(imc).toBeGreaterThan(IMC_LIMITE_OBESIDADE_II);
  });

  it('os limites das faixas estão em ordem crescente', () => {
    expect(IMC_LIMITE_PESO_NORMAL).toBeGreaterThan(IMC_LIMITE_ABAIXO_DO_PESO);
    expect(IMC_LIMITE_SOBREPESO).toBeGreaterThan(IMC_LIMITE_PESO_NORMAL);
    expect(IMC_LIMITE_OBESIDADE_I).toBeGreaterThan(IMC_LIMITE_SOBREPESO);
    expect(IMC_LIMITE_OBESIDADE_II).toBeGreaterThan(IMC_LIMITE_OBESIDADE_I);
  });
});

/* ==========================================================================================
 * TEST.11 — toEqual(): comparação profunda e a armadilha da referência  (slides 20 e 21)
 *
 * Arrays e objetos são comparados por REFERÊNCIA (endereço na memória). Dois arrays com o
 * mesmo conteúdo, criados separadamente, são objetos diferentes: toBe FALHA.
 * toEqual compara o CONTEÚDO, item a item (deep equality): é o certo para arrays e objetos.
 * Usar toBe em arrays/objetos é o erro mais comum de quem está começando.
 * ======================================================================================== */
describe('classificarImc — toEqual', () => {
  it('classifica uma lista de IMCs e compara o array inteiro com toEqual', () => {
    const imcs = [17, 22, 27];

    const faixas = imcs.map(classificarImc);

    expect(faixas).toEqual(['Abaixo do peso', 'Peso normal', 'Sobrepeso']);
  });

  it('mostra a armadilha: mesmo conteúdo, referências diferentes', () => {
    const faixas = [17, 22].map(classificarImc);
    const esperado = ['Abaixo do peso', 'Peso normal'];

    expect(faixas).not.toBe(esperado);
    expect(faixas).toEqual(esperado);
  });

  it('compara um objeto com o resultado de uma pessoa', () => {
    const imc = calcularImc(100, 2);

    const resultado = { imc, faixa: classificarImc(imc) };

    expect(resultado).toEqual({ imc: 25, faixa: 'Sobrepeso' });
  });
});

/* ==========================================================================================
 * TEST.12 — toContain(): item dentro de uma lista ou trecho dentro de um texto
 *           (slides 22 a 24)
 *
 * toContain(item) passa se o array TEM o item (compara com ===) ou se o texto TEM o trecho.
 * É a resposta do quiz do slide 23: para saber se ['ADMIN', 'EDITOR'] contém 'ADMIN', o
 * certo é expect(permissoes).toContain('ADMIN') — toBe e toEqual comparariam a lista inteira.
 * ======================================================================================== */
describe('classificarImc — toContain', () => {
  /*
   * Exemplo 1 — item numa lista.
   * O que faz: classifica três IMCs (17, 22 e 31) e guarda os rótulos num array.
   * Por quê: queremos saber só se "Peso normal" aparece, sem depender da posição nem dos
   * outros itens. toEqual exigiria escrever o array inteiro; toContain olha um item só.
   * Esperado: o array ['Abaixo do peso', 'Peso normal', 'Obesidade grau I'] contém
   * 'Peso normal' -> verde.
   */
  it('a lista de faixas geradas contém "Peso normal"', () => {
    // Arrange
    const imcs = [17, 22, 31];

    // Act
    const faixas = imcs.map(classificarImc);

    // Assert
    expect(faixas).toContain('Peso normal');
  });

  /*
   * Exemplo 2 — o contrário, com .not.
   * O que faz: classifica só IMCs saudáveis (19 e 24).
   * Por quê: garante que nenhuma faixa de obesidade aparece para quem está no peso normal.
   * Esperado: a lista não contém 'Obesidade grau I' -> verde.
   */
  it('a lista de pessoas no peso normal não contém faixa de obesidade', () => {
    const faixas = [19, 24].map(classificarImc);

    expect(faixas).not.toContain('Obesidade grau I');
  });

  /*
   * Exemplo 3 — trecho dentro de um texto.
   * O que faz: classifica IMC 37 e confere só um pedaço do rótulo.
   * Por quê: as faixas de obesidade têm graus I, II e III; aqui interessa apenas que é uma
   * obesidade. Para textos, toContain procura o trecho (como String.includes).
   * Esperado: 'Obesidade grau II' contém 'Obesidade' -> verde.
   */
  it('o rótulo de IMC 37 contém a palavra "Obesidade"', () => {
    const faixa = classificarImc(37);

    expect(faixa).toContain('Obesidade');
  });
});
