/**
 * Testes de imc-servico.js — TEST.17: mock de função assíncrona (Aula 03, slides 25, 32 e 33).
 *
 * Fica num arquivo próprio, ao lado de imc-servico.js (convenção do slide 13).
 *
 * Por que mockar? obterImcDaPessoa recebe "buscarPessoa", que na vida real chamaria uma API.
 * Teste unitário NUNCA faz conexão de rede: seria lento, instável (flaky) e dependeria de um
 * servidor no ar. Então trocamos a busca por um vi.fn() com resposta programada:
 *   - mockResolvedValue(valor)  -> a promessa RESOLVE com o valor (servidor respondeu OK);
 *   - mockRejectedValue(erro)   -> a promessa REJEITA com o erro (servidor recusou).
 * Para conferir promessas:
 *   - await + expect(...) no valor resolvido;
 *   - await expect(promessa).rejects.toThrow('mensagem') para o erro.
 * Cuidado do debate (slides 40 e 41): mock demais gera falso positivo — se a API real mudar,
 * o teste com mock continua verde. Por isso testes de integração também são necessários.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  MSG_BUSCA_INVALIDA,
  MSG_PESSOA_NAO_ENCONTRADA,
  obterImcDaPessoa,
} from './imc-servico.js';

describe('obterImcDaPessoa — mock de função assíncrona', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /*
   * Exemplo 1 — caminho feliz (servidor responde).
   * O que faz: cria buscarPessoa = vi.fn() que RESOLVE com { peso: 100, altura: 2 }.
   * Por quê: simula a API devolvendo a pessoa, sem rede; o teste fica rápido e previsível.
   * Esperado: IMC 25, e a busca foi chamada 1 vez com o id 7 -> verde.
   */
  it('calcula o IMC com a pessoa devolvida pela API simulada', async () => {
    // Arrange
    const buscarPessoa = vi.fn().mockResolvedValue({ peso: 100, altura: 2 });

    // Act
    const imc = await obterImcDaPessoa(buscarPessoa, 7);

    // Assert
    expect(imc).toBe(25);
    expect(buscarPessoa).toHaveBeenCalledTimes(1);
    expect(buscarPessoa).toHaveBeenCalledWith(7);
  });

  /*
   * Exemplo 2 — servidor recusa (Atividade Prática 2, slide 33).
   * O que faz: a busca REJEITA com o erro 'Servidor recusou a conexão.'.
   * Por quê: o erro da API precisa chegar a quem chamou, sem ser "engolido".
   * Esperado: a promessa rejeita com essa mensagem -> verde. Note o await antes do expect:
   * sem ele, o teste terminaria antes de a promessa rejeitar.
   */
  it('repassa o erro quando o servidor recusa', async () => {
    const buscarPessoa = vi.fn().mockRejectedValue(new Error('Servidor recusou a conexão.'));

    const promessa = obterImcDaPessoa(buscarPessoa, 7);

    await expect(promessa).rejects.toThrow('Servidor recusou a conexão.');
  });

  /*
   * Exemplo 3 — pessoa não existe.
   * O que faz: a busca RESOLVE com null (a API respondeu, mas não achou ninguém).
   * Por quê: "não encontrado" é diferente de "servidor fora": aqui a função lança o próprio
   * erro, com a mensagem MSG_PESSOA_NAO_ENCONTRADA.
   * Esperado: rejeita com 'Pessoa não encontrada.' -> verde.
   */
  it('lança erro quando a pessoa não é encontrada', async () => {
    const buscarPessoa = vi.fn().mockResolvedValue(null);

    await expect(obterImcDaPessoa(buscarPessoa, 99)).rejects.toThrow(MSG_PESSOA_NAO_ENCONTRADA);
  });

  /*
   * Exemplo 4 — dados inválidos vindos da API.
   * O que faz: a busca resolve com altura 0.
   * Por quê: o serviço reaproveita calcularImc, que já devolve null para entrada inválida.
   * Esperado: null (sem erro) -> verde.
   */
  it('devolve null quando a API manda altura inválida', async () => {
    const buscarPessoa = vi.fn().mockResolvedValue({ peso: 70, altura: 0 });

    const imc = await obterImcDaPessoa(buscarPessoa, 3);

    expect(imc).toBeNull();
  });

  /*
   * Exemplo 5 — respostas diferentes em sequência.
   * O que faz: mockResolvedValueOnce programa UMA resposta por chamada: a 1ª acha a pessoa,
   * a 2ª devolve null.
   * Por quê: simula a API mudando de resposta entre chamadas (ex.: pessoa apagada).
   * Esperado: 1ª chamada = 25; 2ª rejeita com "não encontrada" -> verde.
   */
  it('trata respostas diferentes em chamadas seguidas', async () => {
    const buscarPessoa = vi
      .fn()
      .mockResolvedValueOnce({ peso: 100, altura: 2 })
      .mockResolvedValueOnce(null);

    const primeira = await obterImcDaPessoa(buscarPessoa, 1);

    expect(primeira).toBe(25);
    await expect(obterImcDaPessoa(buscarPessoa, 1)).rejects.toThrow(MSG_PESSOA_NAO_ENCONTRADA);
  });

  /*
   * Exemplo 6 — dependência ausente.
   * O que faz: chama sem a função de busca.
   * Por quê: validação no início (return early) evita erro confuso mais adiante.
   * Esperado: rejeita com TypeError e a mensagem MSG_BUSCA_INVALIDA -> verde.
   */
  it('rejeita quando buscarPessoa não é uma função', async () => {
    await expect(obterImcDaPessoa(undefined, 1)).rejects.toThrow(TypeError);
    await expect(obterImcDaPessoa(undefined, 1)).rejects.toThrow(MSG_BUSCA_INVALIDA);
  });
});
