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
/*
 * Exemplo 1 — suite com sub-suites.
 * O que faz: cria a suite calcularImc com duas sub-suites (casos válidos e inválidos), cada uma com
 *   um it.todo (caso planejado).
 * Por quê: o relatório sai em árvore (calcularImc > casos válidos > ...) e mostra qual parte
 *   falhou.
 * Esperado: nada falha; os casos aparecem como "todo".
 */
describe('calcularImc', () => {
  describe('casos válidos', () => {
    it.todo('calcula peso / (altura * altura)');
  });

  describe('casos inválidos', () => {
    it.todo('devolve null para peso ou altura zero, negativos ou não numéricos');
  });
});

/*
 * Exemplo 2 — uma suite por função.
 * O que faz: cria a suite classificarImc, separada da anterior.
 * Por quê: cada função do módulo tem a sua suite; os casos reais vêm a partir da TEST.3.
 * Esperado: 1 caso "todo", sem falha.
 */
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
  /*
   * Exemplo 1 — caso BDD com it.
   * O que faz: o título é a frase BDD e o corpo marca Given, When e Then.
   * Por quê: quem lê o relatório entende a regra sem abrir o código.
   * Esperado: 100 / (2 * 2) = 25 -> verde.
   */
  it('dado 100 kg e 2 m, quando calcula o IMC, então o resultado é 25', () => {
    // Given
    const peso = 100;
    const altura = 2;
    // When
    const imc = calcularImc(peso, altura);
    // Then
    expect(imc).toBe(25);
  });

  /*
   * Exemplo 2 — o mesmo caso com test.
   * O que faz: usa test no lugar de it, em uma linha.
   * Por quê: it e test são idênticos; escolha um e mantenha o padrão no projeto.
   * Esperado: 80 / (2 * 2) = 20 -> verde.
   */
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
  /*
   * Exemplo 1 — expect, .not e assertions.
   * O que faz: expect.assertions(2) exige 2 asserções; confere que o IMC é 25 e que NÃO é 24.9.
   * Por quê: mostra o expect positivo, o negativo (.not) e a proteção contra teste sem asserção.
   * Esperado: as 2 asserções rodam e passam -> verde.
   */
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
  /*
   * Exemplo 1 — AAA no caminho feliz.
   * O que faz: prepara peso e altura (Arrange), calcula em uma linha (Act) e confere (Assert).
   * Por quê: as 3 fases separadas deixam o teste legível para qualquer colega.
   * Esperado: 90 / (1,5 * 1,5) = 40 -> verde.
   */
  it('calcula o IMC de 90 kg e 1,5 m', () => {
    // Arrange
    const peso = 90;
    const altura = 1.5;

    // Act
    const imc = calcularImc(peso, altura);

    // Assert
    expect(imc).toBe(40);
  });

  /*
   * Exemplo 2 — AAA num caso de borda.
   * O que faz: mesma estrutura AAA com altura 0.
   * Por quê: o padrão vale também para erros: dividir por zero daria Infinity, a função devolve
   *   null.
   * Esperado: null -> verde.
   */
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
  /*
   * Exemplo 1 — toBe com texto.
   * O que faz: classifica 17 e compara o rótulo com toBe.
   * Por quê: texto é primitivo: === compara o conteúdo.
   * Esperado: 'Abaixo do peso' -> verde.
   */
  it('classifica IMC 17 como "Abaixo do peso" (texto é primitivo)', () => {
    const faixa = classificarImc(17);

    expect(faixa).toBe('Abaixo do peso');
  });

  /*
   * Exemplo 2 — toBe com número exato.
   * O que faz: calcula 100 kg e 2 m.
   * Por quê: a divisão é exata, então toBe funciona (com decimais, ver TEST.7).
   * Esperado: 25 -> verde.
   */
  it('calcula exatamente 25 para 100 kg e 2 m (número exato)', () => {
    const imc = calcularImc(100, 2);

    expect(imc).toBe(25);
  });

  /*
   * Exemplo 3 — toBe no limite.
   * O que faz: classifica exatamente 25, o limite entre Peso normal e Sobrepeso.
   * Por quê: limites são onde os erros aparecem (< trocado por <=).
   * Esperado: 'Sobrepeso' -> verde.
   */
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
  /*
   * Exemplo 1 — o problema do decimal.
   * O que faz: soma 0.1 + 0.2 e compara com 0.3 das duas formas.
   * Por quê: prova que toBe falharia (0.30000000000000004) e que toBeCloseTo resolve.
   * Esperado: not.toBe e toBeCloseTo passam -> verde.
   */
  it('mostra por que toBe não serve para decimais', () => {
    const soma = 0.1 + 0.2;

    expect(soma).not.toBe(0.3);
    expect(soma).toBeCloseTo(0.3);
  });

  /*
   * Exemplo 2 — toBeCloseTo no IMC real.
   * O que faz: calcula 70 kg e 1,75 m (22,857142...).
   * Por quê: o resultado é uma dízima; conferimos só 2 casas decimais.
   * Esperado: ≈ 22,86 -> verde.
   */
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
  /*
   * Exemplo 1 — peso zero.
   * O que faz: calcula com peso 0.
   * Por quê: peso zero não é uma pessoa real; a função recusa.
   * Esperado: null -> verde.
   */
  it('devolve null para peso zero', () => {
    expect(calcularImc(0, 1.75)).toBeNull();
  });

  /*
   * Exemplo 2 — valores negativos.
   * O que faz: testa peso negativo e altura negativa.
   * Por quê: altura negativa ao quadrado daria um IMC positivo e errado; a validação barra.
   * Esperado: null nos dois casos -> verde.
   */
  it('devolve null para peso ou altura negativos', () => {
    expect(calcularImc(-70, 1.75)).toBeNull();
    expect(calcularImc(70, -1.75)).toBeNull();
  });

  /*
   * Exemplo 3 — não numéricos.
   * O que faz: testa NaN, Infinity e o texto '70'.
   * Por quê: dados vindos de formulário podem chegar como texto ou NaN.
   * Esperado: null nos três casos -> verde.
   */
  it('devolve null para valores que não são números finitos', () => {
    expect(calcularImc(NaN, 1.75)).toBeNull();
    expect(calcularImc(70, Infinity)).toBeNull();
    expect(calcularImc('70', 1.75)).toBeNull();
  });

  /*
   * Exemplo 4 — classificar inválido.
   * O que faz: classifica null e NaN.
   * Por quê: garante que o null de calcularImc não vira uma faixa falsa.
   * Esperado: null nos dois casos -> verde.
   */
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
  /*
   * Exemplo 1 — constantes exportadas.
   * O que faz: confere que os 5 limites existem.
   * Por quê: se alguém apagar um export, este teste avisa antes da tela quebrar.
   * Esperado: todos definidos -> verde.
   */
  it('exporta as constantes de limite das faixas', () => {
    expect(IMC_LIMITE_ABAIXO_DO_PESO).toBeDefined();
    expect(IMC_LIMITE_PESO_NORMAL).toBeDefined();
    expect(IMC_LIMITE_SOBREPESO).toBeDefined();
    expect(IMC_LIMITE_OBESIDADE_I).toBeDefined();
    expect(IMC_LIMITE_OBESIDADE_II).toBeDefined();
  });

  /*
   * Exemplo 2 — definido e não nulo.
   * O que faz: classifica 22 e confere toBeDefined e not.toBeNull.
   * Por quê: toBeDefined sozinho aceitaria null; a combinação barra os dois.
   * Esperado: 'Peso normal' -> verde.
   */
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
  /*
   * Exemplo 1 — acima de um limite.
   * O que faz: calcula 120 kg e 1,70 m (~41,5) e compara com o limite de 40.
   * Por quê: o valor exato não importa aqui, só que passa do limite.
   * Esperado: 41,5 > 40 -> verde.
   */
  it('120 kg e 1,70 m dá IMC (~41,5) acima do limite da obesidade grau II', () => {
    const imc = calcularImc(120, 1.7);

    expect(imc).toBeGreaterThan(IMC_LIMITE_OBESIDADE_II);
  });

  /*
   * Exemplo 2 — ordem dos limites.
   * O que faz: compara cada limite com o anterior.
   * Por quê: classificarImc depende da ordem crescente; trocar um valor quebraria a classificação.
   * Esperado: 18,5 < 25 < 30 < 35 < 40 -> verde.
   */
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
  /*
   * Exemplo 1 — array com toEqual.
   * O que faz: classifica 17, 22 e 27 com map e compara o array inteiro.
   * Por quê: toEqual confere item a item, na ordem.
   * Esperado: ['Abaixo do peso', 'Peso normal', 'Sobrepeso'] -> verde.
   */
  it('classifica uma lista de IMCs e compara o array inteiro com toEqual', () => {
    const imcs = [17, 22, 27];

    const faixas = imcs.map(classificarImc);

    expect(faixas).toEqual(['Abaixo do peso', 'Peso normal', 'Sobrepeso']);
  });

  /*
   * Exemplo 2 — a armadilha da referência.
   * O que faz: compara dois arrays de mesmo conteúdo com toBe e com toEqual.
   * Por quê: são objetos diferentes na memória: toBe falha, toEqual passa.
   * Esperado: not.toBe e toEqual passam -> verde.
   */
  it('mostra a armadilha: mesmo conteúdo, referências diferentes', () => {
    const faixas = [17, 22].map(classificarImc);
    const esperado = ['Abaixo do peso', 'Peso normal'];

    expect(faixas).not.toBe(esperado);
    expect(faixas).toEqual(esperado);
  });

  /*
   * Exemplo 3 — objeto com toEqual.
   * O que faz: monta { imc, faixa } para 100 kg e 2 m.
   * Por quê: toEqual também compara objetos, propriedade a propriedade.
   * Esperado: { imc: 25, faixa: 'Sobrepeso' } -> verde.
   */
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

/* ==========================================================================================
 * TEST.13 — beforeEach() e afterEach(): testes isolados  (slides 34 a 37)
 *
 * beforeEach(fn) roda ANTES de cada teste da suite; afterEach(fn) roda DEPOIS de cada um.
 * Servem para recriar os dados do zero e limpar o que sobrou (mocks, timers, variáveis).
 * Regra de ouro (slide 37): cada teste é 100% independente — passa sozinho, em qualquer
 * ordem ou em paralelo. Um teste NUNCA deve depender do que o anterior deixou.
 * ======================================================================================== */
describe('calcularImc — beforeEach e afterEach', () => {
  /** Pessoa usada pelos testes; recriada antes de CADA teste. */
  let pessoa;
  /** Conta quantas vezes o beforeEach rodou (só para a demonstração). */
  let execucoesDoBeforeEach = 0;

  beforeEach(() => {
    pessoa = { peso: 70, altura: 1.75 };
    execucoesDoBeforeEach += 1;
  });

  afterEach(() => {
    pessoa = undefined;
  });

  /*
   * Exemplo 1 — o teste "estraga" os dados de propósito.
   * O que faz: troca o peso da pessoa para 140 kg e confere o IMC dobrado (~45,7).
   * Por quê: mostra que um teste pode alterar o estado; o próximo exemplo prova que isso
   * não vaza, porque o beforeEach recria a pessoa.
   * Esperado: IMC ~45,71 -> verde.
   */
  it('altera o peso da pessoa (só neste teste)', () => {
    pessoa.peso = 140;

    const imc = calcularImc(pessoa.peso, pessoa.altura);

    expect(imc).toBeCloseTo(45.71, 2);
  });

  /*
   * Exemplo 2 — o isolamento em ação.
   * O que faz: lê a pessoa de novo, logo depois do teste que mudou o peso para 140.
   * Por quê: se os testes compartilhassem estado, o peso ainda seria 140. Como o beforeEach
   * recriou { peso: 70, altura: 1.75 }, o resultado volta a ~22,86.
   * Esperado: peso 70 e IMC ~22,86 -> verde, em qualquer ordem de execução.
   */
  it('recebe a pessoa original de novo (o teste anterior não vazou)', () => {
    const imc = calcularImc(pessoa.peso, pessoa.altura);

    expect(pessoa.peso).toBe(70);
    expect(imc).toBeCloseTo(22.86, 2);
  });

  /*
   * Exemplo 3 — prova de que o beforeEach roda uma vez POR TESTE.
   * O que faz: confere o contador incrementado no beforeEach.
   * Por quê: esta é a 3ª execução da suite, então o beforeEach já rodou 3 vezes.
   * Esperado: 3 -> verde. (Este contador é só demonstração: em teste real, não dependa da
   * ordem dos testes.)
   */
  it('o beforeEach rodou antes de cada um dos 3 testes', () => {
    expect(execucoesDoBeforeEach).toBe(3);
  });
});

/* ==========================================================================================
 * TEST.14 — vi.fn(): função simulada  (slide 26)
 *
 * vi.fn() cria uma função "de mentira" que MEMORIZA cada chamada: quantas vezes foi
 * chamada, com quais argumentos e o que devolveu. Pode receber uma implementação
 * (vi.fn(funcaoReal)) ou ter o retorno programado (mockReturnValue).
 * Matchers próprios: toHaveBeenCalled, toHaveBeenCalledTimes(n), toHaveBeenCalledWith(...).
 * No IMC não há dependência externa para isolar, então os exemplos são didáticos: o uso
 * típico é substituir uma API, um callback ou um alerta (ver TEST.17).
 * ======================================================================================== */
describe('classificarImc — vi.fn()', () => {
  /*
   * Exemplo 1 — embrulhar a função real para observá-la.
   * O que faz: cria espiao = vi.fn(classificarImc); o espião executa a função de verdade e
   * ainda anota a chamada.
   * Por quê: mostra os 3 registros do vi.fn — chamada, argumento e retorno.
   * Esperado: chamado 1 vez, com 22.86, devolvendo 'Peso normal' -> verde.
   */
  it('registra a chamada, o argumento e o retorno', () => {
    // Arrange
    const espiao = vi.fn(classificarImc);

    // Act
    const faixa = espiao(22.86);

    // Assert
    expect(espiao).toHaveBeenCalled();
    expect(espiao).toHaveBeenCalledTimes(1);
    expect(espiao).toHaveBeenCalledWith(22.86);
    expect(faixa).toBe('Peso normal');
  });

  /*
   * Exemplo 2 — usar o vi.fn como callback.
   * O que faz: passa o espião para o map de uma lista de 3 IMCs.
   * Por quê: callbacks são o lugar mais comum de vi.fn — conferimos que o map chamou a
   * função uma vez por item. (O map passa 3 argumentos: item, índice e array; por isso o
   * toHaveBeenNthCalledWith lista os três.)
   * Esperado: 3 chamadas; a 2ª com (27, 1, imcs) -> verde.
   */
  it('conta as chamadas feitas pelo map', () => {
    const espiao = vi.fn(classificarImc);
    const imcs = [17, 27, 41];

    imcs.map(espiao);

    expect(espiao).toHaveBeenCalledTimes(3);
    expect(espiao).toHaveBeenNthCalledWith(2, 27, 1, imcs);
  });

  /*
   * Exemplo 3 — programar o retorno.
   * O que faz: cria um vi.fn() sem implementação e manda devolver sempre 'Sobrepeso'.
   * Por quê: é assim que se finge uma dependência (ex.: uma API) com resposta controlada.
   * Esperado: devolve 'Sobrepeso' mesmo recebendo 17 -> verde.
   */
  it('devolve um valor programado com mockReturnValue', () => {
    const classificadorFalso = vi.fn().mockReturnValue('Sobrepeso');

    const faixa = classificadorFalso(17);

    expect(faixa).toBe('Sobrepeso');
    expect(classificadorFalso).toHaveBeenCalledWith(17);
  });
});

/* ==========================================================================================
 * TEST.15 — vi.spyOn() e vi.restoreAllMocks()  (slide 27)
 *
 * vi.fn() cria uma função do zero; vi.spyOn(objeto, 'metodo') EMBRULHA um método que já
 * existe num objeto real. Sem mais nada, o método original continua funcionando e o espião
 * só observa. Com mockReturnValue / mockImplementation, o comportamento é trocado.
 * vi.restoreAllMocks() devolve os métodos originais: chame no afterEach para um teste não
 * contaminar o outro (o Number.isFinite trocado afetaria TODOS os testes seguintes).
 * ======================================================================================== */
describe('calcularImc — vi.spyOn()', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /*
   * Exemplo 1 — só observar.
   * O que faz: espia Number.isFinite, que o calcularImc usa para validar peso e altura.
   * Por quê: prova que a função realmente valida as DUAS entradas, sem alterar nada.
   * Esperado: IMC 25 (cálculo real) e isFinite chamado 2 vezes: com 100 e com 2 -> verde.
   */
  it('observa as validações feitas por calcularImc', () => {
    // Arrange
    const espiao = vi.spyOn(Number, 'isFinite');

    // Act
    const imc = calcularImc(100, 2);

    // Assert
    expect(imc).toBe(25);
    expect(espiao).toHaveBeenCalledTimes(2);
    expect(espiao).toHaveBeenCalledWith(100);
    expect(espiao).toHaveBeenCalledWith(2);
  });

  /*
   * Exemplo 2 — sobrescrever temporariamente.
   * O que faz: força Number.isFinite a responder sempre false.
   * Por quê: simula "valores inválidos" sem mudar a entrada, provando que calcularImc
   * depende dessa validação para devolver null.
   * Esperado: calcularImc(100, 2) devolve null -> verde.
   */
  it('força a validação a falhar com mockReturnValue', () => {
    vi.spyOn(Number, 'isFinite').mockReturnValue(false);

    const imc = calcularImc(100, 2);

    expect(imc).toBeNull();
  });

  /*
   * Exemplo 3 — o restoreAllMocks funcionou.
   * O que faz: calcula de novo, depois do teste que "quebrou" o Number.isFinite.
   * Por quê: se o afterEach não restaurasse, este cálculo daria null.
   * Esperado: 25 (método original de volta) -> verde.
   */
  it('depois do restoreAllMocks, o Number.isFinite original voltou', () => {
    expect(calcularImc(100, 2)).toBe(25);
  });
});
