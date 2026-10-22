import { describe, it, expect, beforeEach } from 'vitest';
import { criarBanco } from './banco.js';
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

describe('repositório de produtos', () => {
  let banco;

  beforeEach(() => {
    banco = criarBanco();
  });

  it('cadastra e lista o produto', () => {
    cadastrarProduto(banco, PRODUTO_OK);

    expect(listarProdutos(banco)).toEqual([{ ...PRODUTO_OK, id: 1 }]);
  });

  it('lança erro e não grava quando inválido', () => {
    expect(() => cadastrarProduto(banco, { ...PRODUTO_OK, preco: 0 })).toThrow();
    expect(listarProdutos(banco)).toHaveLength(0);
  });

  it('a tela lista os produtos cadastrados', () => {
    cadastrarProduto(banco, PRODUTO_OK);

    const tela = criarTelaProduto(banco);

    expect(tela.querySelector('tbody').rows[0].cells[1].textContent).toBe('Teclado');
  });
});
