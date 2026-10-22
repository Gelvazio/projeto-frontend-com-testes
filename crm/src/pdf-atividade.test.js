import { describe, it, expect, vi } from 'vitest';
import {
  extrairAtividade, extrairItens, extrairLinhas, gerarPdf, limparTexto, NOME_ARQUIVO_PDF,
} from './pdf-atividade.js';

const PAGINA = `
  <h1>Atividade   Teste</h1>
  <section class="cartao"><h2>Capacidades</h2><p>Texto A</p><ul><li>Item 1</li></ul></section>
  <section class="cartao"><h2>Tabela</h2>
    <table><tr><th>Arquivo</th><td>banco.js</td></tr></table></section>
  <section class="cartao"><h2>Itens</h2>
    <div class="exercicio-box"><div class="exercicio-header">ITEM 1</div>
      <p><span>CAPACIDADE:</span> C5</p><p><span>Comando:</span> Faça</p></div></section>
  <section class="cartao"><p>Sem título</p></section>`;

function criarPagina() {
  document.body.innerHTML = PAGINA;
  return document;
}

describe('limparTexto', () => {
  it('troca símbolos que o PDF não desenha e normaliza espaços', () => {
    expect(limparTexto('a → b ≥ c  ☒')).toBe('a -> b >= c X');
  });

  it('remove emojis e mantém acentos', () => {
    expect(limparTexto('📥 Exportação')).toBe('Exportação');
  });
});

describe('extração da página', () => {
  it('extrairLinhas junta parágrafos, listas e linhas de tabela na ordem', () => {
    const secoes = criarPagina().querySelectorAll('.cartao');

    expect(extrairLinhas(secoes[0])).toEqual(['Texto A', 'Item 1']);
    expect(extrairLinhas(secoes[1])).toEqual(['Arquivo | banco.js']);
  });

  it('extrairItens devolve cabeçalho e linhas de cada exercício', () => {
    const secao = criarPagina().querySelectorAll('.cartao')[2];

    expect(extrairItens(secao)).toEqual([
      { cabecalho: 'ITEM 1', linhas: ['CAPACIDADE: C5', 'Comando: Faça'] },
    ]);
  });

  it('extrairAtividade ignora seção sem título e deixa linhas vazias nas seções de itens', () => {
    const dados = extrairAtividade(criarPagina());

    expect(dados.titulo).toBe('Atividade Teste');
    expect(dados.secoes.map((secao) => secao.titulo)).toEqual(['Capacidades', 'Tabela', 'Itens']);
    expect(dados.secoes[2].linhas).toEqual([]);
    expect(dados.secoes[2].itens).toHaveLength(1);
  });
});

describe('gerarPdf', () => {
  it('gera um PDF com o fundo pintado e ao menos uma página', () => {
    const dados = extrairAtividade(criarPagina());

    const doc = gerarPdf(dados);

    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    expect(NOME_ARQUIVO_PDF).toBe('Atividade-SA-CRM.pdf');
  });

  it('usa a fábrica de documento injetada (mock) e desenha o fundo', () => {
    const doc = gerarPdf({ titulo: 'T', secoes: [] });
    const criarDocumento = vi.fn(() => doc);

    gerarPdf({ titulo: 'T', secoes: [] }, criarDocumento);

    expect(criarDocumento).toHaveBeenCalledTimes(1);
  });
});
