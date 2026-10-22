import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarApiFalsa } from './api-falsa.js';
import {
  cadastrarProduto, criarTelaProduto, listarProdutos, temEstoque, validarProduto,
} from './produto.js';

const PRODUTO_OK = { nome: 'Teclado', preco: 120.9, estoque: 10 };

describe('validarProduto', () => {
  it('não devolve erros para um produto válido', () => {
    expect(validarProduto(PRODUTO_OK)).toEqual([]);
  });

  it('exige nome', () => {
    expect(validarProduto({ ...PRODUTO_OK, nome: '' })).toContain('Nome obrigatório');
  });

  it('recusa preço zero ou negativo', () => {
    expect(validarProduto({ ...PRODUTO_OK, preco: 0 })).toContain('Preço deve ser maior que zero');
    expect(validarProduto({ ...PRODUTO_OK, preco: -5 })).toHaveLength(1);
  });

  it('aceita estoque zero, mas recusa negativo e fracionado', () => {
    expect(validarProduto({ ...PRODUTO_OK, estoque: 0 })).toEqual([]);
    expect(validarProduto({ ...PRODUTO_OK, estoque: -1 })).toContain('Estoque inválido');
    expect(validarProduto({ ...PRODUTO_OK, estoque: 1.5 })).toContain('Estoque inválido');
  });
});

describe('temEstoque', () => {
  it.each([
    [5, 5, true],
    [5, 6, false],
    [0, 1, false],
  ])('estoque %s para %s unidades → %s', (estoque, quantidade, esperado) => {
    expect(temEstoque({ estoque }, quantidade)).toBe(esperado);
  });
});

describe('acesso à API de produtos', () => {
  let api;

  beforeEach(() => {
    api = criarApiFalsa();
  });

  it('cadastra e lista o produto', () => {
    return cadastrarProduto(api, PRODUTO_OK)
      .then(() => listarProdutos(api))
      .then((lista) => expect(lista).toEqual([{ ...PRODUTO_OK, id: 1 }]));
  });

  it('recusa e não grava quando inválido', () => {
    return cadastrarProduto(api, { ...PRODUTO_OK, preco: 0 })
      .then(
        () => {
          throw new Error('deveria ter recusado');
        },
        (erro) => expect(erro.message).toContain('Preço')
      )
      .then(() => listarProdutos(api))
      .then((lista) => expect(lista).toHaveLength(0));
  });

  it('a tela lista os produtos cadastrados', () => {
    return cadastrarProduto(api, PRODUTO_OK).then(() => {
      const tela = criarTelaProduto(api);

      return vi.waitFor(() => {
        expect(tela.querySelector('tbody').rows[0].cells[1].textContent).toBe('Teclado');
      });
    });
  });
});
