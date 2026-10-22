import { beforeEach, describe, expect, it, vi } from 'vitest';
import { criarApiFalsa } from './api-falsa.js';
import { cadastrarCliente } from './cliente.js';
import { cadastrarProduto } from './produto.js';
import {
  COLECAO_PEDIDOS, calcularTotal, criarPedido, criarTelaPedido, listarPedidos,
} from './pedido.js';

const DATA_FIXA = new Date('2026-10-22T12:00:00.000Z');
const ESTOQUE_INICIAL = 10;

/**
 * Cria uma API falsa com um cliente (id 1) e um produto (id 1, preço 5,5).
 * @returns {Promise<object>} API semeada.
 */
function semearApi() {
  const api = criarApiFalsa();
  return cadastrarCliente(api, { nome: 'Ana', idade: 30, cidade: 'Lages', salario: 1000 })
    .then(() => cadastrarProduto(api, { nome: 'Caneta', preco: 5.5, estoque: ESTOQUE_INICIAL }))
    .then(() => api);
}

describe('calcularTotal', () => {
  it('soma preço x quantidade', () => {
    const itens = [{ preco: 10, quantidade: 2 }, { preco: 5, quantidade: 1 }];
    expect(calcularTotal(itens)).toBe(25);
  });

  it('devolve 0 para lista vazia', () => {
    expect(calcularTotal([])).toBe(0);
  });

  it('arredonda em 2 casas', () => {
    const itens = [{ preco: 0.1, quantidade: 3 }];
    expect(calcularTotal(itens)).toBe(0.3);
    expect(calcularTotal([{ preco: 1.005, quantidade: 1 }])).toBeCloseTo(1, 1);
  });
});

describe('criarPedido', () => {
  let api;
  let agora;

  beforeEach(() => {
    agora = vi.fn(() => DATA_FIXA);
    return semearApi().then((apiSemeada) => {
      api = apiSemeada;
    });
  });

  it('grava total e data e devolve o pedido com id', () => {
    const dados = { clienteId: 1, itens: [{ produtoId: 1, quantidade: 2 }] };
    return criarPedido(api, dados, agora).then((pedido) => {
      expect(pedido.id).toBe(1);
      expect(pedido.total).toBe(11);
      expect(pedido.data).toBe(DATA_FIXA.toISOString());
      expect(pedido.itens).toEqual([{ produtoId: 1, nome: 'Caneta', preco: 5.5, quantidade: 2 }]);
      expect(agora).toHaveBeenCalledTimes(1);
    });
  });

  it('dá baixa no estoque', () => {
    const dados = { clienteId: 1, itens: [{ produtoId: 1, quantidade: 3 }] };
    return criarPedido(api, dados, agora)
      .then(() => api.buscarPorId('produtos', 1))
      .then((produto) => expect(produto.estoque).toBe(ESTOQUE_INICIAL - 3));
  });

  it('aceita comprar exatamente o estoque', () => {
    const dados = { clienteId: 1, itens: [{ produtoId: 1, quantidade: ESTOQUE_INICIAL }] };
    return criarPedido(api, dados, agora)
      .then(() => api.buscarPorId('produtos', 1))
      .then((produto) => expect(produto.estoque).toBe(0));
  });

  it('recusa uma unidade a mais que o estoque e não grava nada', () => {
    const dados = { clienteId: 1, itens: [{ produtoId: 1, quantidade: ESTOQUE_INICIAL + 1 }] };
    return criarPedido(api, dados, agora).then(
      () => { throw new Error('deveria ter recusado'); },
      (erro) => expect(erro.message).toBe('Sem estoque de Caneta')
    ).then(() => Promise.all([api.buscarPorId('produtos', 1), listarPedidos(api)]))
      .then(([produto, pedidos]) => {
        expect(produto.estoque).toBe(ESTOQUE_INICIAL);
        expect(pedidos).toEqual([]);
      });
  });

  it.each([
    ['cliente inexistente', { clienteId: 99, itens: [{ produtoId: 1, quantidade: 1 }] },
      'Cliente não encontrado'],
    ['itens vazios', { clienteId: 1, itens: [] }, 'Pedido sem itens'],
    ['produto inexistente', { clienteId: 1, itens: [{ produtoId: 99, quantidade: 1 }] },
      'Produto não encontrado'],
    ['quantidade zero', { clienteId: 1, itens: [{ produtoId: 1, quantidade: 0 }] },
      'Quantidade inválida'],
  ])('recusa pedido inválido (%s) e não grava nada', (_nome, dados, mensagem) => {
    return criarPedido(api, dados, agora).then(
      () => { throw new Error('deveria ter recusado'); },
      (erro) => expect(erro.message).toBe(mensagem)
    ).then(() => Promise.all([api.listar('produtos'), api.listar(COLECAO_PEDIDOS)]))
      .then(([produtos, pedidos]) => {
        expect(produtos[0].estoque).toBe(ESTOQUE_INICIAL);
        expect(pedidos).toEqual([]);
      });
  });

  it('não dá baixa se um dos itens falha', () => {
    const dados = {
      clienteId: 1,
      itens: [{ produtoId: 1, quantidade: 2 }, { produtoId: 99, quantidade: 1 }],
    };
    const promessa = criarPedido(api, dados, agora);
    return expect(promessa).rejects.toThrow('Produto não encontrado')
      .then(() => api.buscarPorId('produtos', 1))
      .then((produto) => expect(produto.estoque).toBe(ESTOQUE_INICIAL));
  });
});

describe('criarTelaPedido', () => {
  it('cria o pedido ao enviar o formulário', () => {
    return semearApi().then((api) => {
      const secao = criarTelaPedido(api);
      document.body.replaceChildren(secao);
      const formulario = secao.querySelector('form');

      return vi.waitFor(() => {
        expect(formulario.elements.clienteId.options.length).toBe(1);
        expect(formulario.elements.produtoId.options.length).toBe(1);
      }).then(() => {
        formulario.elements.quantidade.value = '2';
        formulario.requestSubmit();
        return vi.waitFor(() => {
          const linhas = secao.querySelectorAll('.lista-pedidos li');
          expect(linhas.length).toBe(1);
          expect(linhas[0].textContent).toBe('#1 - cliente 1 - R$ 11');
        });
      }).then(() => api.buscarPorId('produtos', 1))
        .then((produto) => expect(produto.estoque).toBe(ESTOQUE_INICIAL - 2));
    });
  });

  it('mostra o erro na mensagem quando o estoque não basta', () => {
    return semearApi().then((api) => {
      const secao = criarTelaPedido(api);
      document.body.replaceChildren(secao);
      const formulario = secao.querySelector('form');

      return vi.waitFor(() => {
        expect(formulario.elements.produtoId.options.length).toBe(1);
      }).then(() => {
        formulario.elements.quantidade.value = String(ESTOQUE_INICIAL + 1);
        formulario.requestSubmit();
        return vi.waitFor(() => {
          expect(secao.querySelector('.mensagem').textContent).toBe('Sem estoque de Caneta');
        });
      });
    });
  });
});
