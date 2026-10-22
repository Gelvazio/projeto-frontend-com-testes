/** Cadastro de produto: regras de validação, repositório sobre o banco e tela. */

import { criarTelaCadastro } from './tela.js';

export const COLECAO_PRODUTOS = 'produtos';
export const CAMPOS_PRODUTO = [
  { nome: 'nome', rotulo: 'Nome', tipo: 'text' },
  { nome: 'preco', rotulo: 'Preço', tipo: 'number' },
  { nome: 'estoque', rotulo: 'Estoque', tipo: 'number' },
];
const COLUNAS_PRODUTO = [
  { chave: 'id', rotulo: 'ID' },
  { chave: 'nome', rotulo: 'Nome' },
  { chave: 'preco', rotulo: 'Preço' },
  { chave: 'estoque', rotulo: 'Estoque' },
];

/**
 * Confere os dados de um produto.
 * @param {{nome: string, preco: number, estoque: number}} produto - Dados.
 * @returns {string[]} Lista de erros (vazia quando está tudo certo).
 */
export function validarProduto(produto) {
  const erros = [];
  if (!produto.nome) erros.push('Nome obrigatório');
  if (!(produto.preco > 0)) erros.push('Preço deve ser maior que zero');
  const estoqueValido = Number.isInteger(produto.estoque) && produto.estoque >= 0;
  if (!estoqueValido) erros.push('Estoque inválido');
  return erros;
}

/**
 * Valida e grava um produto.
 * @param {object} banco - Banco injetado.
 * @param {object} dados - Dados do produto.
 * @returns {object} Produto salvo, com id.
 * @throws {Error} Com os erros de validação separados por "; ".
 */
export function cadastrarProduto(banco, dados) {
  const erros = validarProduto(dados);
  if (erros.length > 0) throw new Error(erros.join('; '));
  return banco.criar(COLECAO_PRODUTOS, dados);
}

/**
 * @param {object} banco - Banco injetado.
 * @returns {object[]} Todos os produtos.
 */
export function listarProdutos(banco) {
  return banco.listar(COLECAO_PRODUTOS);
}

/**
 * Indica se há estoque para a quantidade pedida.
 * @param {{estoque: number}} produto - Produto.
 * @param {number} quantidade - Quantidade desejada.
 * @returns {boolean} true se o estoque cobre a quantidade.
 */
export function temEstoque(produto, quantidade) {
  return produto.estoque >= quantidade;
}

/**
 * Monta a tela de produtos.
 * @param {object} banco - Banco injetado.
 * @returns {HTMLElement} Seção da tela.
 */
export function criarTelaProduto(banco) {
  return criarTelaCadastro({
    titulo: 'Produtos',
    campos: CAMPOS_PRODUTO,
    colunas: COLUNAS_PRODUTO,
    aoSalvar: (dados) => cadastrarProduto(banco, dados),
    aoListar: () => listarProdutos(banco),
  });
}
