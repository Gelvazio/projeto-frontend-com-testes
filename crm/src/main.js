/** Ponto de entrada: liga banco, login, menu e telas. Só aqui se toca a página inteira. */

import './estilo.css';
import { criarBanco } from './banco.js';
import { criarTelaCliente } from './cliente.js';
import { criarTelaLogin } from './login.js';
import { ITENS_MENU, montarMenu } from './menu.js';
import { criarTelaPedido } from './pedido.js';
import { criarTelaProduto } from './produto.js';
import { criarRepositorioUsuarios, criarTelaUsuario } from './usuario.js';

const CHAVE_BANCO = 'crm:banco';
const DADOS_INICIAIS = {
  usuarios: [
    { id: 1, login: 'admin', senha: 'admin123', status: 1 },
    { id: 2, login: 'inativo', senha: '123', status: 0 },
  ],
};

/** @returns {object} Dados salvos no navegador (ou os iniciais). */
function lerDadosSalvos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_BANCO)) ?? DADOS_INICIAIS;
  } catch (erro) {
    return DADOS_INICIAIS;
  }
}

/** @param {object} dados - Dados a guardar no navegador (nosso "db.json"). */
function salvarDados(dados) {
  try {
    localStorage.setItem(CHAVE_BANCO, JSON.stringify(dados));
  } catch (erro) {
    // sem armazenamento: os dados valem só nesta visita
  }
}

const banco = criarBanco({ dadosIniciais: lerDadosSalvos(), aoMudar: salvarDados });
const raiz = document.querySelector('#app');
const menuArea = document.querySelector('#menu');
const tela = document.querySelector('#tela');

const TELAS = {
  clientes: () => criarTelaCliente(banco),
  produtos: () => criarTelaProduto(banco),
  pedidos: () => criarTelaPedido(banco),
  usuarios: () => criarTelaUsuario(banco),
};

/** Volta para a tela de login. */
function mostrarLogin() {
  menuArea.replaceChildren();
  tela.replaceChildren(criarTelaLogin(mostrarSistema, criarRepositorioUsuarios(banco)));
}

/** Mostra o menu e a primeira tela depois do login. */
function mostrarSistema() {
  const abrir = (id) => {
    if (id === 'sair') return mostrarLogin();
    tela.replaceChildren(TELAS[id]());
  };
  menuArea.replaceChildren(montarMenu(ITENS_MENU, abrir));
  abrir(ITENS_MENU[0].id);
  menuArea.querySelector('button').setAttribute('aria-current', 'page');
}

raiz.hidden = false;
mostrarLogin();
