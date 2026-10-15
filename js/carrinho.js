/**
 * Regras do carrinho e do filtro da loja (lógica pura, sem DOM e sem alert).
 * Origem: assets/script.js de marcosvpaz-svg (addToCart, removeFromCart, renderProducts).
 * O carrinho é uma lista de { ...produto, quantidade } e nunca é alterado no lugar.
 */

const CATEGORIA_TODAS = 'todas';

/**
 * Adiciona um produto ao carrinho; se já existir, soma 1 na quantidade.
 * @param {Array<{id: number, quantidade: number}>} carrinho - Carrinho atual.
 * @param {{id: number}} produto - Produto a adicionar.
 * @returns {Array<object>} Novo carrinho.
 */
function adicionarAoCarrinho(carrinho, produto) {
  const jaExiste = carrinho.some((item) => item.id === produto.id);
  if (!jaExiste) return [...carrinho, Object.assign({}, produto, { quantidade: 1 })];

  return carrinho.map((item) =>
    item.id === produto.id
      ? Object.assign({}, item, { quantidade: item.quantidade + 1 })
      : item
  );
}

/**
 * Remove um produto do carrinho por completo.
 * @param {Array<{id: number}>} carrinho - Carrinho atual.
 * @param {number} id - Identificador do produto.
 * @returns {Array<object>} Novo carrinho sem o produto.
 */
function removerDoCarrinho(carrinho, id) {
  return carrinho.filter((item) => item.id !== id);
}

/**
 * Soma o valor de todos os itens (preço x quantidade).
 * @param {Array<{preco: number, quantidade: number}>} carrinho - Carrinho atual.
 * @returns {number} Total em reais; 0 para carrinho vazio.
 */
function calcularTotal(carrinho) {
  return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

/**
 * Conta o total de unidades no carrinho.
 * @param {Array<{quantidade: number}>} carrinho - Carrinho atual.
 * @returns {number} Soma das quantidades.
 */
function contarItens(carrinho) {
  return carrinho.reduce((soma, item) => soma + item.quantidade, 0);
}

/**
 * Filtra produtos por categoria e por trecho do nome (sem diferenciar maiúsculas).
 * @param {Array<{nome: string, categoria: string}>} produtos - Lista completa.
 * @param {{categoria?: string, busca?: string}} [filtro] - Critérios do filtro.
 * @returns {Array<object>} Produtos que atendem aos dois critérios.
 */
function filtrarProdutos(produtos, filtro = {}) {
  const { categoria = CATEGORIA_TODAS, busca = '' } = filtro;
  const termo = busca.trim().toLowerCase();

  return produtos.filter((produto) => {
    const categoriaConfere = categoria === CATEGORIA_TODAS || produto.categoria === categoria;
    const buscaConfere = produto.nome.toLowerCase().includes(termo);
    return categoriaConfere && buscaConfere;
  });
}

/**
 * Formata um valor em reais no padrão brasileiro.
 * @param {number} valor - Valor em reais.
 * @returns {string} Texto como "R$ 1.299,90".
 */
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* Permite importar as funções nos testes (Node); no navegador não existe `module`. */
if (typeof module !== 'undefined') {
  module.exports = {
    CATEGORIA_TODAS,
    adicionarAoCarrinho,
    removerDoCarrinho,
    calcularTotal,
    contarItens,
    filtrarProdutos,
    formatarPreco,
  };
}
