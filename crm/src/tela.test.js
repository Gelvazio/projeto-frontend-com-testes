import { describe, it, expect, vi } from 'vitest';
import { criarTabela, criarTelaCadastro, lerCampos } from './tela.js';

const CAMPOS = [
  { nome: 'nome', rotulo: 'Nome', tipo: 'text' },
  { nome: 'idade', rotulo: 'Idade', tipo: 'number' },
];
const COLUNAS = [{ chave: 'nome', rotulo: 'Nome' }];

/** Dispara o envio do formulário da tela. */
function enviar(secao) {
  secao.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
}

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
    const aoSalvar = vi.fn().mockResolvedValue({});
    const aoListar = vi.fn().mockResolvedValue([]);
    const secao = criarTelaCadastro(
      { titulo: 'T', campos: CAMPOS, colunas: COLUNAS, aoSalvar, aoListar },
      document
    );
    secao.querySelector('[name=nome]').value = 'Ana';
    secao.querySelector('[name=idade]').value = '20';

    enviar(secao);

    expect(aoSalvar).toHaveBeenCalledWith({ nome: 'Ana', idade: 20 });
    return vi.waitFor(() => expect(aoListar).toHaveBeenCalledTimes(2));
  });

  it('mostra a mensagem de erro quando aoSalvar recusa', () => {
    const aoSalvar = vi.fn().mockRejectedValue(new Error('Nome obrigatório'));
    const aoListar = vi.fn().mockResolvedValue([]);
    const secao = criarTelaCadastro(
      { titulo: 'T', campos: CAMPOS, colunas: COLUNAS, aoSalvar, aoListar },
      document
    );

    enviar(secao);

    return vi.waitFor(() =>
      expect(secao.querySelector('.mensagem').textContent).toBe('Nome obrigatório')
    );
  });

  it('mostra o erro quando a lista não carrega (banco fora do ar)', () => {
    const aoListar = vi.fn().mockRejectedValue(new Error('Sem banco'));
    const secao = criarTelaCadastro(
      { titulo: 'T', campos: CAMPOS, colunas: COLUNAS, aoSalvar: vi.fn(), aoListar },
      document
    );

    return vi.waitFor(() =>
      expect(secao.querySelector('.mensagem').textContent).toBe('Sem banco')
    );
  });
});
