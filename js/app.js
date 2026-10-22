/**
 * Única parte do projeto que toca o DOM: liga a tela às funções puras dos outros scripts.
 * Carregado por último no index.html (as funções vêm dos scripts anteriores).
 */

const CHAVE_TEMA = 'projeto-frontend-com-testes:tema';
const URL_COVERAGE = 'coverage/index.html';
const MSG_IMC_INVALIDO = 'Digite valores válidos.';
const MSG_CARRINHO_VAZIO = 'Seu carrinho está vazio.';
const MSG_SEM_PRODUTOS = 'Nenhum produto encontrado.';

/**
 * Cria um elemento com classe e texto opcionais.
 * @param {string} tag - Nome da tag.
 * @param {{classe?: string, texto?: string}} [opcoes] - Classe CSS e texto.
 * @returns {HTMLElement} Elemento criado.
 */
function criarElemento(tag, opcoes = {}) {
  const elemento = document.createElement(tag);
  if (opcoes.classe) elemento.className = opcoes.classe;
  if (opcoes.texto) elemento.textContent = opcoes.texto;
  return elemento;
}

/**
 * Remove todos os filhos de um elemento.
 * @param {HTMLElement} elemento - Elemento a esvaziar.
 */
function limparFilhos(elemento) {
  while (elemento.firstChild) elemento.removeChild(elemento.firstChild);
}

/** Liga o formulário da calculadora de IMC. */
function iniciarImc() {
  const formulario = document.querySelector('#formulario-imc');
  const resultado = document.querySelector('#resultado-imc');

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nome = formulario.elements.nome.value.trim();
    const peso = Number(formulario.elements.peso.value);
    const altura = Number(formulario.elements.altura.value);

    const imc = calcularImc(peso, altura);
    if (imc === null) {
      resultado.textContent = MSG_IMC_INVALIDO;
      return;
    }
    const classificacao = classificarImc(imc);
    const quem = nome ? `${nome}, seu` : 'Seu';
    resultado.textContent = `${quem} IMC é ${imc.toFixed(1)}: ${classificacao}.`;
  });
}

/** Liga os botões e eventos da lâmpada. */
function iniciarLampada() {
  const lampada = document.querySelector('#lampada');
  let estado = ESTADO_APAGADA;

  /**
   * Aplica um evento e atualiza o atributo que o CSS usa para desenhar a lâmpada.
   * @param {string} evento - Um dos EVENTO_* da lâmpada.
   */
  function aplicar(evento) {
    estado = proximoEstadoLampada(estado, evento);
    lampada.dataset.estado = estado;
  }

  document.querySelector('#lampada-ligar').addEventListener('click', () => aplicar(EVENTO_LIGAR));
  document
    .querySelector('#lampada-desligar')
    .addEventListener('click', () => aplicar(EVENTO_DESLIGAR));
  lampada.addEventListener('mouseenter', () => aplicar(EVENTO_MOUSE_ENTRAR));
  lampada.addEventListener('mouseleave', () => aplicar(EVENTO_MOUSE_SAIR));
  lampada.addEventListener('dblclick', () => aplicar(EVENTO_DUPLO_CLIQUE));
  lampada.dataset.estado = estado;
}

/**
 * Cria o card de um produto da loja.
 * @param {{id: number, nome: string, preco: number, icone: string}} produto - Produto.
 * @param {(produto: object) => void} aoAdicionar - Chamada ao clicar em Adicionar.
 * @returns {HTMLLIElement} Item da vitrine.
 */
function criarCardProduto(produto, aoAdicionar) {
  const item = criarElemento('li', { classe: 'produto' });
  const botao = criarElemento('button', { classe: 'botao', texto: 'Adicionar' });
  botao.type = 'button';
  botao.addEventListener('click', () => aoAdicionar(produto));

  item.append(
    criarElemento('span', { classe: 'produto__icone', texto: produto.icone }),
    criarElemento('h3', { classe: 'produto__nome', texto: produto.nome }),
    criarElemento('p', { classe: 'produto__preco', texto: formatarPreco(produto.preco) }),
    botao
  );
  return item;
}

/**
 * Cria a linha de um item do carrinho.
 * @param {{id: number, nome: string, preco: number, quantidade: number}} item - Item.
 * @param {(id: number) => void} aoRemover - Chamada ao clicar em Remover.
 * @returns {HTMLLIElement} Linha do carrinho.
 */
function criarLinhaCarrinho(item, aoRemover) {
  const linha = criarElemento('li', { classe: 'carrinho__item' });
  const subtotal = formatarPreco(item.preco * item.quantidade);
  const botao = criarElemento('button', { classe: 'botao botao--secundario', texto: 'Remover' });
  botao.type = 'button';
  botao.addEventListener('click', () => aoRemover(item.id));

  const descricao = `${item.quantidade}x ${item.nome} — ${subtotal}`;
  linha.append(criarElemento('span', { texto: descricao }), botao);
  return linha;
}

/**
 * Preenche o seletor com as categorias e marca "todas".
 * @param {HTMLSelectElement} seletor - Campo de categoria.
 */
function montarSeletorCategorias(seletor) {
  const opcoes = CATEGORIAS.map((categoria) => {
    const opcao = criarElemento('option', { texto: categoria.rotulo });
    opcao.value = categoria.valor;
    return opcao;
  });
  limparFilhos(seletor);
  opcoes.forEach((opcao) => seletor.appendChild(opcao));
  seletor.value = CATEGORIA_TODAS;
}

/**
 * Troca os itens de uma lista; sem itens, mostra uma linha com a mensagem de vazio.
 * @param {HTMLUListElement} lista - Lista a preencher.
 * @param {HTMLLIElement[]} itens - Itens novos.
 * @param {string} mensagemVazia - Texto quando não há itens.
 */
function preencherLista(lista, itens, mensagemVazia) {
  if (itens.length === 0) {
    limparFilhos(lista);
    lista.appendChild(criarElemento('li', { texto: mensagemVazia }));
    return;
  }
  limparFilhos(lista);
  itens.forEach((item) => lista.appendChild(item));
}

/** Liga a loja: filtros, vitrine e carrinho. */
function iniciarLoja() {
  const vitrine = document.querySelector('#vitrine');
  const listaCarrinho = document.querySelector('#carrinho-itens');
  const total = document.querySelector('#carrinho-total');
  const contador = document.querySelector('#carrinho-contador');
  const campoBusca = document.querySelector('#busca');
  const seletor = document.querySelector('#categoria');
  let carrinho = [];

  /** Redesenha a lista, o total e o contador a partir do carrinho atual. */
  function desenharCarrinho() {
    const linhas = carrinho.map((item) =>
      criarLinhaCarrinho(item, (id) => {
        carrinho = removerDoCarrinho(carrinho, id);
        desenharCarrinho();
      })
    );
    preencherLista(listaCarrinho, linhas, MSG_CARRINHO_VAZIO);
    total.textContent = formatarPreco(calcularTotal(carrinho));
    contador.textContent = String(contarItens(carrinho));
  }

  /** Redesenha a vitrine com os produtos que passam no filtro atual. */
  function desenharVitrine() {
    const produtos = filtrarProdutos(PRODUTOS, {
      categoria: seletor.value,
      busca: campoBusca.value,
    });
    const cards = produtos.map((produto) =>
      criarCardProduto(produto, (escolhido) => {
        carrinho = adicionarAoCarrinho(carrinho, escolhido);
        desenharCarrinho();
      })
    );
    preencherLista(vitrine, cards, MSG_SEM_PRODUTOS);
  }

  montarSeletorCategorias(seletor);
  seletor.addEventListener('change', desenharVitrine);
  campoBusca.addEventListener('input', desenharVitrine);
  desenharVitrine();
  desenharCarrinho();
}

/**
 * Lê o tema salvo ou, sem ele, a preferência do sistema.
 * @returns {string} claro ou escuro.
 */
function lerTemaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    if (salvo === TEMA_CLARO || salvo === TEMA_ESCURO) return salvo;
  } catch (erro) {
    // armazenamento indisponível: segue com a preferência do sistema
  }
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefereEscuro ? TEMA_ESCURO : TEMA_CLARO;
}

/** Liga o botão de tema claro/escuro e lembra a escolha. */
function iniciarTema() {
  const botao = document.querySelector('#botao-tema');
  let tema = lerTemaInicial();

  /** Aplica o tema atual na página e no texto do botão. */
  function aplicar() {
    document.documentElement.dataset.tema = tema;
    botao.textContent = rotuloBotaoTema(tema);
  }

  botao.addEventListener('click', () => {
    tema = alternarTema(tema);
    aplicar();
    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch (erro) {
      // sem armazenamento: o tema vale só nesta visita
    }
  });
  aplicar();
}

/** Liga o botão COVERAGE: abre o relatório de coverage num modal. */
function iniciarCoverage() {
  const modal = document.querySelector('#modal-coverage');
  const quadro = document.querySelector('#modal-coverage-quadro');

  document.querySelector('#botao-coverage').addEventListener('click', () => {
    if (!quadro.getAttribute('src')) quadro.src = URL_COVERAGE;
    modal.showModal();
  });
  document
    .querySelector('#modal-coverage-fechar')
    .addEventListener('click', () => modal.close());
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.close();
  });
}

iniciarTema();
iniciarCoverage();
iniciarImc();
iniciarLampada();
iniciarLoja();
