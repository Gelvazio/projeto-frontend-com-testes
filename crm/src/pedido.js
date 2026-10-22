/** Pedido de venda: cálculo do total, regras de criação (baixa de estoque) e tela. */

import { COLECAO_CLIENTES, listarClientes } from './cliente.js';
import { COLECAO_PRODUTOS, listarProdutos, temEstoque } from './produto.js';

export const COLECAO_PEDIDOS = 'pedidos';
const CASAS_DECIMAIS = 2;
const MSG_CLIENTE_NAO_ENCONTRADO = 'Cliente não encontrado';
const MSG_PEDIDO_SEM_ITENS = 'Pedido sem itens';
const MSG_QUANTIDADE_INVALIDA = 'Quantidade inválida';
const MSG_PRODUTO_NAO_ENCONTRADO = 'Produto não encontrado';
const CLASSE_MENSAGEM = '.mensagem';
const CLASSE_LISTA = '.lista-pedidos';

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
 * Confere um item pedido: quantidade, produto e estoque.
 * @param {object} api - API injetada.
 * @param {{produtoId: number, quantidade: number}} pedido - Item pedido.
 * @returns {Promise<{produto: object, item: object}>} Produto atual e item com preço.
 * (Recusa se quantidade, produto ou estoque forem inválidos.)
 */
function conferirItem(api, { produtoId, quantidade }) {
  const quantidadeValida = Number.isInteger(quantidade) && quantidade > 0;
  if (!quantidadeValida) return Promise.reject(new Error(MSG_QUANTIDADE_INVALIDA));

  return api.buscarPorId(COLECAO_PRODUTOS, produtoId).then((produto) => {
    if (!produto) return Promise.reject(new Error(MSG_PRODUTO_NAO_ENCONTRADO));
    if (!temEstoque(produto, quantidade)) {
      return Promise.reject(new Error(`Sem estoque de ${produto.nome}`));
    }
    const item = { produtoId, nome: produto.nome, preco: produto.preco, quantidade };
    return { produto, item };
  });
}

/**
 * Confere se o cliente do pedido existe.
 * @param {object} api - API injetada.
 * @param {number} clienteId - Id do cliente.
 * @returns {Promise<object>} Cliente encontrado (recusa se não existir).
 */
function conferirCliente(api, clienteId) {
  return api.buscarPorId(COLECAO_CLIENTES, clienteId).then((cliente) => {
    if (!cliente) return Promise.reject(new Error(MSG_CLIENTE_NAO_ENCONTRADO));
    return cliente;
  });
}

/**
 * Dá baixa no estoque de cada produto conferido.
 * @param {object} api - API injetada.
 * @param {{produto: object, item: object}[]} conferidos - Itens já conferidos.
 * @returns {Promise<object[]>} Produtos atualizados.
 */
function darBaixaNoEstoque(api, conferidos) {
  return Promise.all(
    conferidos.map(({ produto, item }) =>
      api.atualizar(COLECAO_PRODUTOS, produto.id, {
        estoque: produto.estoque - item.quantidade,
      })
    )
  );
}

/**
 * Cria um pedido, grava e dá baixa no estoque (só depois de todas as conferências).
 * @param {object} api - API injetada.
 * @param {{clienteId: number, itens: {produtoId: number, quantidade: number}[]}} dados - Pedido.
 * @param {() => Date} [agora] - Relógio injetável (nos testes vira um mock).
 * @returns {Promise<object>} Pedido salvo.
 * (Recusa se cliente, itens, produto, quantidade ou estoque forem inválidos.)
 */
export function criarPedido(api, dados, agora = () => new Date()) {
  return conferirCliente(api, dados.clienteId)
    .then(() => {
      if (dados.itens.length === 0) return Promise.reject(new Error(MSG_PEDIDO_SEM_ITENS));
      return Promise.all(dados.itens.map((pedido) => conferirItem(api, pedido)));
    })
    .then((conferidos) => {
      const itens = conferidos.map(({ item }) => item);
      return darBaixaNoEstoque(api, conferidos).then(() =>
        api.criar(COLECAO_PEDIDOS, {
          clienteId: dados.clienteId,
          itens,
          total: calcularTotal(itens),
          data: agora().toISOString(),
        })
      );
    });
}

/**
 * @param {object} api - API injetada.
 * @returns {Promise<object[]>} Todos os pedidos.
 */
export function listarPedidos(api) {
  return api.listar(COLECAO_PEDIDOS);
}

/**
 * Cria um <select> vazio.
 * @param {string} nome - Atributo name.
 * @returns {HTMLSelectElement} Seletor.
 */
function criarSeletor(nome) {
  const seletor = document.createElement('select');
  seletor.name = nome;
  return seletor;
}

/**
 * Preenche um seletor com as opções dos registros.
 * @param {HTMLSelectElement} seletor - Seletor a preencher.
 * @param {{id: number, nome: string}[]} registros - Opções.
 */
function preencherSeletor(seletor, registros) {
  const opcoes = registros.map((registro) => new Option(registro.nome, String(registro.id)));
  seletor.replaceChildren(...opcoes);
}

/**
 * Cria o campo de quantidade e o botão de venda.
 * @returns {{quantidade: HTMLInputElement, botao: HTMLButtonElement}} Controles.
 */
function criarControlesVenda() {
  const quantidade = Object.assign(document.createElement('input'), {
    name: 'quantidade', type: 'number', value: '1',
  });
  const botao = Object.assign(document.createElement('button'), {
    className: 'botao', type: 'submit', textContent: 'Vender',
  });
  return { quantidade, botao };
}

/**
 * Cria a lista de pedidos para exibir.
 * @param {object[]} pedidos - Pedidos salvos.
 * @returns {HTMLLIElement[]} Linhas da lista.
 */
function criarLinhasPedidos(pedidos) {
  return pedidos.map((pedido) => {
    const item = document.createElement('li');
    item.textContent = `#${pedido.id} - cliente ${pedido.clienteId} - R$ ${pedido.total}`;
    return item;
  });
}

/**
 * Monta a tela de pedidos (cliente, produto, quantidade e lista).
 * @param {object} api - API injetada.
 * @returns {HTMLElement} Seção da tela (preenchida depois que o fetch responde).
 */
export function criarTelaPedido(api) {
  const secao = document.createElement('section');
  secao.className = 'cartao';
  secao.innerHTML = `<h2>Pedidos</h2><form class="formulario"></form>
    <p class="mensagem"></p><ul class="lista-pedidos"></ul>`;
  const formulario = secao.querySelector('form');
  const mensagem = secao.querySelector(CLASSE_MENSAGEM);
  const seletorCliente = criarSeletor('clienteId');
  const seletorProduto = criarSeletor('produtoId');
  const { quantidade, botao } = criarControlesVenda();
  formulario.append(seletorCliente, seletorProduto, quantidade, botao);

  /** @param {Error} erro - Erro a mostrar abaixo do formulário. */
  function mostrarErro(erro) {
    mensagem.textContent = erro.message;
  }

  /** @returns {Promise} Carrega clientes, produtos e pedidos e redesenha a tela. */
  function carregar() {
    return Promise.all([listarClientes(api), listarProdutos(api), listarPedidos(api)]).then(
      ([clientes, produtos, pedidos]) => {
        preencherSeletor(seletorCliente, clientes);
        preencherSeletor(seletorProduto, produtos);
        secao.querySelector(CLASSE_LISTA).replaceChildren(...criarLinhasPedidos(pedidos));
      }
    );
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const itens = [
      { produtoId: Number(seletorProduto.value), quantidade: Number(quantidade.value) },
    ];
    criarPedido(api, { clienteId: Number(seletorCliente.value), itens })
      .then(() => {
        mensagem.textContent = '';
        return carregar();
      })
      .catch(mostrarErro);
  });

  carregar().catch(mostrarErro);
  return secao;
}
