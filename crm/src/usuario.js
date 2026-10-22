/** Cadastro de usuário (login). Dados no formato {id, login, senha, status}. */

import { criarTelaCadastro } from './tela.js';

export const COLECAO_USUARIOS = 'usuarios';
export const STATUS_ATIVO = 1;
export const STATUS_INATIVO = 0;
export const CAMPOS_USUARIO = [
  { nome: 'login', rotulo: 'Login', tipo: 'text' },
  { nome: 'senha', rotulo: 'Senha', tipo: 'password' },
  { nome: 'status', rotulo: 'Status (1=ativo, 0=inativo)', tipo: 'number' },
];
const COLUNAS_USUARIO = [
  { chave: 'id', rotulo: 'ID' },
  { chave: 'login', rotulo: 'Login' },
  { chave: 'status', rotulo: 'Status' },
];

/**
 * @param {{status: number}} usuario - Usuário.
 * @returns {boolean} true quando o status é 1 (ativo).
 */
export function estaAtivo(usuario) {
  return usuario.status === STATUS_ATIVO;
}

/**
 * Confere os dados de um usuário.
 * @param {{login: string, senha: string, status: number}} usuario - Dados.
 * @returns {string[]} Lista de erros (vazia quando está tudo certo).
 */
export function validarUsuario(usuario) {
  const erros = [];
  if (!usuario.login) erros.push('Login obrigatório');
  if (!usuario.senha) erros.push('Senha obrigatória');
  const statusValido = usuario.status === STATUS_ATIVO || usuario.status === STATUS_INATIVO;
  if (!statusValido) erros.push('Status deve ser 1 ou 0');
  return erros;
}

/**
 * Cria o repositório de usuários sobre o banco injetado.
 * @param {object} banco - Banco injetado.
 * @returns {{cadastrar: Function, listar: Function, buscarPorLogin: Function}} Repositório.
 */
export function criarRepositorioUsuarios(banco) {
  /** @param {string} login - Login procurado. @returns {object|null} Usuário ou null. */
  function buscarPorLogin(login) {
    return banco.listar(COLECAO_USUARIOS).find((usuario) => usuario.login === login) ?? null;
  }

  /**
   * @param {object} dados - Dados do novo usuário.
   * @returns {object} Usuário salvo.
   * @throws {Error} Se inválido ou se o login já existe.
   */
  function cadastrar(dados) {
    const erros = validarUsuario(dados);
    if (erros.length > 0) throw new Error(erros.join('; '));
    if (buscarPorLogin(dados.login)) throw new Error('Login já cadastrado');
    return banco.criar(COLECAO_USUARIOS, dados);
  }

  return { cadastrar, buscarPorLogin, listar: () => banco.listar(COLECAO_USUARIOS) };
}

/**
 * Monta a tela de usuários.
 * @param {object} banco - Banco injetado.
 * @returns {HTMLElement} Seção da tela.
 */
export function criarTelaUsuario(banco) {
  const repositorio = criarRepositorioUsuarios(banco);
  return criarTelaCadastro({
    titulo: 'Usuários',
    campos: CAMPOS_USUARIO,
    colunas: COLUNAS_USUARIO,
    aoSalvar: (dados) => repositorio.cadastrar(dados),
    aoListar: () => repositorio.listar(),
  });
}
