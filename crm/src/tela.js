/**
 * Monta uma tela de cadastro genérica (formulário + tabela) a partir de uma descrição.
 * Cliente, produto e usuário reaproveitam este mesmo molde (Open/Closed).
 */

const CLASSE_MENSAGEM = 'mensagem';

/**
 * Lê os campos do formulário e converte os numéricos.
 * @param {HTMLFormElement} formulario - Formulário da tela.
 * @param {{nome: string, tipo: string}[]} campos - Descrição dos campos.
 * @returns {object} Dados digitados.
 */
export function lerCampos(formulario, campos) {
  const dados = {};
  campos.forEach((campo) => {
    const valor = formulario.elements[campo.nome].value;
    dados[campo.nome] = campo.tipo === 'number' ? Number(valor) : valor.trim();
  });
  return dados;
}

/**
 * Cria o rótulo + input de um campo.
 * @param {{nome: string, rotulo: string, tipo: string}} campo - Descrição do campo.
 * @param {Document} documento - Documento onde criar.
 * @returns {HTMLLabelElement} Campo pronto.
 */
function criarCampo(campo, documento) {
  const rotulo = documento.createElement('label');
  rotulo.className = 'campo';
  rotulo.textContent = campo.rotulo;
  const entrada = documento.createElement('input');
  entrada.name = campo.nome;
  entrada.type = campo.tipo;
  entrada.autocomplete = 'off';
  rotulo.append(entrada);
  return rotulo;
}

/**
 * Cria a tabela com os registros.
 * @param {{chave: string, rotulo: string}[]} colunas - Colunas exibidas.
 * @param {object[]} registros - Linhas.
 * @param {Document} documento - Documento onde criar.
 * @returns {HTMLTableElement} Tabela preenchida.
 */
export function criarTabela(colunas, registros, documento) {
  const tabela = documento.createElement('table');
  tabela.className = 'tabela';
  const cabecalho = tabela.createTHead().insertRow();
  colunas.forEach((coluna) => {
    cabecalho.insertCell().textContent = coluna.rotulo;
  });
  const corpo = tabela.createTBody();
  registros.forEach((registro) => {
    const linha = corpo.insertRow();
    colunas.forEach((coluna) => {
      linha.insertCell().textContent = String(registro[coluna.chave]);
    });
  });
  return tabela;
}

/**
 * Monta a tela de cadastro.
 * @param {{titulo: string, campos: object[], colunas: object[], aoSalvar: Function,
 *   aoListar: Function}} descricao - O que a tela mostra e como salva/lista.
 * @param {Document} [documento] - Documento (injetável nos testes).
 * @returns {HTMLElement} Seção da tela.
 */
export function criarTelaCadastro(descricao, documento = document) {
  const secao = documento.createElement('section');
  secao.className = 'cartao';
  const titulo = documento.createElement('h2');
  titulo.textContent = descricao.titulo;
  const formulario = documento.createElement('form');
  formulario.className = 'formulario';
  descricao.campos.forEach((campo) => formulario.append(criarCampo(campo, documento)));
  const botao = documento.createElement('button');
  botao.className = 'botao';
  botao.type = 'submit';
  botao.textContent = 'Salvar';
  formulario.append(botao);
  const mensagem = documento.createElement('p');
  mensagem.className = CLASSE_MENSAGEM;
  const area = documento.createElement('div');

  /** Redesenha a tabela com os dados atuais. */
  function desenhar() {
    area.replaceChildren(criarTabela(descricao.colunas, descricao.aoListar(), documento));
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    try {
      descricao.aoSalvar(lerCampos(formulario, descricao.campos));
      mensagem.textContent = '';
      formulario.reset();
      desenhar();
    } catch (erro) {
      mensagem.textContent = erro.message;
    }
  });

  secao.append(titulo, formulario, mensagem, area);
  desenhar();
  return secao;
}
