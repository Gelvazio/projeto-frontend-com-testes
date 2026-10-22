/** Regra de autenticação. Recebe o repositório de usuários por parâmetro (injeção). */

import { estaAtivo } from './usuario.js';

export const MOTIVO_CAMPOS_VAZIOS = 'Informe login e senha';
export const MOTIVO_NAO_ENCONTRADO = 'Usuário não encontrado';
export const MOTIVO_SENHA_INVALIDA = 'Senha inválida';
export const MOTIVO_INATIVO = 'Usuário inativo';

/**
 * Tenta autenticar um usuário.
 * @param {string} login - Login digitado.
 * @param {string} senha - Senha digitada.
 * @param {{buscarPorLogin: (login: string) => object|null}} repositorio - Repositório de usuários.
 * @returns {{sucesso: boolean, usuario?: object, motivo?: string}} Resultado do login.
 */
export function autenticar(login, senha, repositorio) {
  if (!login || !senha) return { sucesso: false, motivo: MOTIVO_CAMPOS_VAZIOS };

  const usuario = repositorio.buscarPorLogin(login);
  if (!usuario) return { sucesso: false, motivo: MOTIVO_NAO_ENCONTRADO };
  if (usuario.senha !== senha) return { sucesso: false, motivo: MOTIVO_SENHA_INVALIDA };
  if (!estaAtivo(usuario)) return { sucesso: false, motivo: MOTIVO_INATIVO };

  return { sucesso: true, usuario };
}

/**
 * Monta a tela de login.
 * @param {(usuario: object) => void} aoEntrar - Chamada quando o login é aceito.
 * @param {{buscarPorLogin: Function}} repositorio - Repositório de usuários.
 * @returns {HTMLElement} Seção da tela.
 */
export function criarTelaLogin(aoEntrar, repositorio) {
  const secao = document.createElement('section');
  secao.className = 'cartao cartao--login';
  secao.innerHTML = `
    <h2>Acesso ao CRM</h2>
    <form class="formulario">
      <label class="campo">Login<input name="login" autocomplete="off"></label>
      <label class="campo">Senha<input name="senha" type="password"></label>
      <button class="botao" type="submit">Entrar</button>
    </form>
    <p class="mensagem"></p>`;
  secao.querySelector('form').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const { login, senha } = evento.target.elements;
    const resultado = autenticar(login.value.trim(), senha.value, repositorio);
    if (resultado.sucesso) return aoEntrar(resultado.usuario);
    secao.querySelector('.mensagem').textContent = resultado.motivo;
  });
  return secao;
}
