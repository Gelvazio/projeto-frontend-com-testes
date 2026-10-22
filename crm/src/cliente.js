/** Cadastro de cliente: regras de validação, repositório sobre o banco e tela. */

import { criarTelaCadastro } from './tela.js';

export const COLECAO_CLIENTES = 'clientes';
export const IDADE_MINIMA = 0;
export const IDADE_MAXIMA = 120;
export const CAMPOS_CLIENTE = [
  { nome: 'nome', rotulo: 'Nome', tipo: 'text' },
  { nome: 'idade', rotulo: 'Idade', tipo: 'number' },
  { nome: 'cidade', rotulo: 'Cidade', tipo: 'text' },
  { nome: 'salario', rotulo: 'Salário', tipo: 'number' },
];
const COLUNAS_CLIENTE = [
  { chave: 'id', rotulo: 'ID' },
  { chave: 'nome', rotulo: 'Nome' },
  { chave: 'idade', rotulo: 'Idade' },
  { chave: 'cidade', rotulo: 'Cidade' },
  { chave: 'salario', rotulo: 'Salário' },
];

/**
 * Confere os dados de um cliente.
 * @param {{nome: string, idade: number, cidade: string, salario: number}} cliente - Dados.
 * @returns {string[]} Lista de erros (vazia quando está tudo certo).
 */
export function validarCliente(cliente) {
  const erros = [];
  if (!cliente.nome) erros.push('Nome obrigatório');
  const idadeValida = Number.isInteger(cliente.idade)
    && cliente.idade >= IDADE_MINIMA && cliente.idade <= IDADE_MAXIMA;
  if (!idadeValida) erros.push('Idade inválida');
  if (!cliente.cidade) erros.push('Cidade obrigatória');
  if (!(cliente.salario >= 0)) erros.push('Salário inválido');
  return erros;
}

/**
 * Valida e grava um cliente.
 * @param {object} banco - Banco injetado.
 * @param {object} dados - Dados do cliente.
 * @returns {object} Cliente salvo, com id.
 * @throws {Error} Com os erros de validação separados por "; ".
 */
export function cadastrarCliente(banco, dados) {
  const erros = validarCliente(dados);
  if (erros.length > 0) throw new Error(erros.join('; '));
  return banco.criar(COLECAO_CLIENTES, dados);
}

/**
 * @param {object} banco - Banco injetado.
 * @returns {object[]} Todos os clientes.
 */
export function listarClientes(banco) {
  return banco.listar(COLECAO_CLIENTES);
}

/**
 * @param {object} banco - Banco injetado.
 * @param {number} id - Id do cliente.
 * @returns {boolean} true se removeu.
 */
export function removerCliente(banco, id) {
  return banco.remover(COLECAO_CLIENTES, id);
}

/**
 * Monta a tela de clientes.
 * @param {object} banco - Banco injetado.
 * @returns {HTMLElement} Seção da tela.
 */
export function criarTelaCliente(banco) {
  return criarTelaCadastro({
    titulo: 'Clientes',
    campos: CAMPOS_CLIENTE,
    colunas: COLUNAS_CLIENTE,
    aoSalvar: (dados) => cadastrarCliente(banco, dados),
    aoListar: () => listarClientes(banco),
  });
}
