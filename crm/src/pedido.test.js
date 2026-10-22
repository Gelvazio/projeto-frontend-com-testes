import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarBanco } from './banco.js';
import { cadastrarCliente } from './cliente.js';
import { cadastrarProduto, listarProdutos } from './produto.js';
import { calcularTotal, criarPedido, criarTelaPedido, listarPedidos } from './pedido.js';

describe('calcularTotal', () => {
  it('soma preço x quantidade de todos os itens', () => {
    const itens = [{ preco: 10, quantidade: 2 }, { preco: 5, quantidade: 1 }];

    expect(calcularTotal(itens)).toBe(25);
  });

  it('devolve 0 para lista vazia', () => {
    expect(calcularTotal([])).toBe(0);
  });

  it('arredonda em 2 casas (toBeCloseTo para ponto flutuante)', () => {
    const total = calcularTotal([{ preco: 0.1, quantidade: 1 }, { preco: 0.2, quantidade: 1 }]);

    expect(total).toBeCloseTo(0.3, 2);
    expect(total).toBe(0.3);
  });
});

describe('criarPedido', () => {
  let banco;
  const agora = vi.fn(() => new Date('2026-10-22T10:00:00.000Z'));

  beforeEach(() => {
    banco = criarBanco();
    cadastrarCliente(banco, { nome: 'Ana', idade: 30, cidade: 'Blumenau', salario: 3000 });
    cadastrarProduto(banco, { nome: 'Teclado', preco: 100, estoque: 5 });
  });

  it('grava o pedido com total, data (relógio mockado) e itens', () => {
    const pedido = criarPedido(banco, { clienteId: 1, itens: [{ produtoId: 1, quantidade: 2 }] }, agora);

    expect(pedido).toMatchObject({ id: 1, clienteId: 1, total: 200, data: '2026-10-22T10:00:00.000Z' });
    expect(pedido.itens).toEqual([{ produtoId: 1, nome: 'Teclado', preco: 100, quantidade: 2 }]);
    expect(agora).toHaveBeenCalled();
  });

  it('dá baixa no estoque', () => {
    criarPedido(banco, { clienteId: 1, itens: [{ produtoId: 1, quantidade: 2 }] });

    expect(listarProdutos(banco)[0].estoque).toBe(3);
  });

  it('aceita comprar exatamente o estoque e recusa uma unidade a mais', () => {
    expect(() => criarPedido(banco, { clienteId: 1, itens: [{ produtoId: 1, quantidade: 6 }] }))
      .toThrow('Sem estoque de Teclado');
    expect(criarPedido(banco, { clienteId: 1, itens: [{ produtoId: 1, quantidade: 5 }] }).total)
      .toBe(500);
  });

  it.each([
    [{ clienteId: 99, itens: [{ produtoId: 1, quantidade: 1 }] }, 'Cliente não encontrado'],
    [{ clienteId: 1, itens: [] }, 'Pedido sem itens'],
    [{ clienteId: 1, itens: [{ produtoId: 99, quantidade: 1 }] }, 'Produto não encontrado'],
    [{ clienteId: 1, itens: [{ produtoId: 1, quantidade: 0 }] }, 'Quantidade inválida'],
  ])('recusa pedido inválido %#', (dados, mensagem) => {
    expect(() => criarPedido(banco, dados)).toThrow(mensagem);
    expect(listarPedidos(banco)).toHaveLength(0);
  });

  it('a tela cria o pedido ao enviar o formulário', () => {
    const tela = criarTelaPedido(banco);

    tela.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(tela.querySelectorAll('.lista-pedidos li')).toHaveLength(1);
  });
});
