import { describe, it, expect, vi } from 'vitest';
import { criarTabela, criarTelaCadastro, lerCampos } from './tela.js';

const CAMPOS = [
  { nome: 'nome', rotulo: 'Nome', tipo: 'text' },
  { nome: 'idade', rotulo: 'Idade', tipo: 'number' },
];
const COLUNAS = [{ chave: 'nome', rotulo: 'Nome' }];

describe('tela', () => {
  it('lerCampos converte números e remove espaços do texto', () => {
    const formulario = document.createElement('form');
    formulario.innerHTML = '<input name="nome" value="  Ana "><input name="idade" value="30">';

    expect(lerCampos(formulario, CAMPOS)).toEqual({ nome: 'Ana', idade: 30 });
  });

  it('criarTabela cria um cabeçalho e uma linha por registro', () => {
    const tabela = criarTabela(COLUNAS, [{ nome: 'Ana' }, { nome: 'Bia' }], document);

    expect(tabela.rows).toHaveLength(3);
    expect(tabela.rows[2].cells[0].textContent).toBe('Bia');
  });

  it('chama aoSalvar com os dados e redesenha a lista ao enviar', () => {
    const aoSalvar = vi.fn();
    const aoListar = vi.fn().mockReturnValue([]);
    const secao = criarTelaCadastro(
      { titulo: 'T', campos: CAMPOS, colunas: COLUNAS, aoSalvar, aoListar },
      document
    );
    secao.querySelector('[name=nome]').value = 'Ana';
    secao.querySelector('[name=idade]').value = '20';

    secao.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(aoSalvar).toHaveBeenCalledWith({ nome: 'Ana', idade: 20 });
    expect(aoListar).toHaveBeenCalledTimes(2);
  });

  it('mostra a mensagem de erro quando aoSalvar lança erro', () => {
    const aoSalvar = vi.fn(() => {
      throw new Error('Nome obrigatório');
    });
    const secao = criarTelaCadastro(
      { titulo: 'T', campos: CAMPOS, colunas: COLUNAS, aoSalvar, aoListar: () => [] },
      document
    );

    secao.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(secao.querySelector('.mensagem').textContent).toBe('Nome obrigatório');
  });
});
