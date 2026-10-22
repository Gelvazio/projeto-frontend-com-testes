/** Pedido de venda: cálculo do total, regras de criação (baixa de estoque) e tela. */

import { COLECAO_CLIENTES, listarClientes } from './cliente.js';
import { COLECAO_PRODUTOS, listarProdutos, temEstoque } from './produto.js';

export const COLECAO_PEDIDOS = 'pedidos';
const CASAS_DECIMAIS = 2;

/**
 * Soma preço x quantidade de cada item, arredondando em 2 casas.
 * @param {{preco: number, quantidade: number}[]} itens - Itens do pedido.
 * @returns {number} Total do pedido.
 */
export function calcularTotal(itens) {
  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  return Number(total.toFixed(CASAS_DECIMAIS));
}

/**
 * Transforma os itens pedidos em itens com preço, conferindo produto e estoque.
 * @param {object} banco - Banco injetado.
 * @param {{produtoId: number, quantidade: number}[]} pedidos - Itens pedidos.
 * @returns {{produtoId: number, nome: string, preco: number, quantidade: number}[]} Itens.
 * @throws {Error} Se quantidade, produto ou estoque forem inválidos.
 */
function montarItens(banco, pedidos) {
  return pedidos.map(({ produtoId, quantidade }) => {
    if (!(Number.isInteger(quantidade) && quantidade > 0)) {
      throw new Error('Quantidade inválida');
    }
    const produto = banco.buscarPorId(COLECAO_PRODUTOS, produtoId);
    if (!produto) throw new Error('Produto não encontrado');
    if (!temEstoque(produto, quantidade)) throw new Error(`Sem estoque de ${produto.nome}`);
    return { produtoId, nome: produto.nome, preco: produto.preco, quantidade };
  });
}

/**
 * Cria um pedido, grava e dá baixa no estoque.
 * @param {object} banco - Banco injetado.
 * @param {{clienteId: number, itens: {produtoId: number, quantidade: number}[]}} dados - Pedido.
 * @param {() => Date} [agora] - Relógio injetável (nos testes vira um mock).
 * @returns {object} Pedido salvo.
 * @throws {Error} Se cliente, itens, produto, quantidade ou estoque forem inválidos.
 */
export function criarPedido(banco, dados, agora = () => new Date()) {
  if (!banco.buscarPorId(COLECAO_CLIENTES, dados.clienteId)) {
    throw new Error('Cliente não encontrado');
  }
  if (dados.itens.length === 0) throw new Error('Pedido sem itens');

  const itens = montarItens(banco, dados.itens);
  itens.forEach((item) => {
    const produto = banco.buscarPorId(COLECAO_PRODUTOS, item.produtoId);
    banco.atualizar(COLECAO_PRODUTOS, item.produtoId, {
      estoque: produto.estoque - item.quantidade,
    });
  });

  return banco.criar(COLECAO_PEDIDOS, {
    clienteId: dados.clienteId,
    itens,
    total: calcularTotal(itens),
    data: agora().toISOString(),
  });
}

/**
 * @param {object} banco - Banco injetado.
 * @returns {object[]} Todos os pedidos.
 */
export function listarPedidos(banco) {
  return banco.listar(COLECAO_PEDIDOS);
}

/**
 * Cria um <select> com as opções informadas.
 * @param {string} nome - Atributo name.
 * @param {{id: number, nome: string}[]} registros - Opções.
 * @returns {HTMLSelectElement} Seletor pronto.
 */
function criarSeletor(nome, registros) {
  const seletor = document.createElement('select');
  seletor.name = nome;
  registros.forEach((registro) => {
    seletor.append(new Option(registro.nome, String(registro.id)));
  });
  return seletor;
}

/**
 * Monta a tela de pedidos (cliente, produto, quantidade e lista).
 * @param {object} banco - Banco injetado.
 * @returns {HTMLElement} Seção da tela.
 */
export function criarTelaPedido(banco) {
  const secao = document.createElement('section');
  secao.className = 'cartao';
  secao.innerHTML = `<h2>Pedidos</h2><form class="formulario"></form>
    <p class="mensagem"></p><ul class="lista-pedidos"></ul>`;
  const formulario = secao.querySelector('form');
  const quantidade = Object.assign(document.createElement('input'), {
    name: 'quantidade', type: 'number', value: '1',
  });
  const botao = Object.assign(document.createElement('button'), {
    className: 'botao', type: 'submit', textContent: 'Vender',
  });
  formulario.append(
    criarSeletor('clienteId', listarClientes(banco)),
    criarSeletor('produtoId', listarProdutos(banco)),
    quantidade,
    botao
  );

  /** Redesenha a lista de pedidos. */
  function desenhar() {
    const linhas = listarPedidos(banco).map((pedido) => {
      const item = document.createElement('li');
      item.textContent = `#${pedido.id} · cliente ${pedido.clienteId} · R$ ${pedido.total}`;
      return item;
    });
    secao.querySelector('.lista-pedidos').replaceChildren(...linhas);
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const campos = formulario.elements;
    try {
      criarPedido(banco, {
        clienteId: Number(campos.clienteId.value),
        itens: [{ produtoId: Number(campos.produtoId.value), quantidade: Number(quantidade.value) }],
      });
      secao.querySelector('.mensagem').textContent = '';
      desenhar();
    } catch (erro) {
      secao.querySelector('.mensagem').textContent = erro.message;
    }
  });
  desenhar();
  return secao;
}
