import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarApiFalsa } from './api-falsa.js';
import {
  cadastrarCliente, criarTelaCliente, listarClientes, removerCliente, validarCliente,
} from './cliente.js';

const CLIENTE_OK = { nome: 'Ana', idade: 30, cidade: 'Blumenau', salario: 3500.5 };

describe('validarCliente', () => {
  it('não devolve erros para um cliente válido', () => {
    expect(validarCliente(CLIENTE_OK)).toEqual([]);
  });

  it('exige nome e cidade', () => {
    const erros = validarCliente({ ...CLIENTE_OK, nome: '', cidade: '' });

    expect(erros).toContain('Nome obrigatório');
    expect(erros).toContain('Cidade obrigatória');
  });

  it.each([-1, 121, 20.5, NaN])('recusa a idade %s (valores-limite)', (idade) => {
    expect(validarCliente({ ...CLIENTE_OK, idade })).toContain('Idade inválida');
  });

  it.each([0, 120])('aceita a idade limite %s', (idade) => {
    expect(validarCliente({ ...CLIENTE_OK, idade })).toEqual([]);
  });

  it('recusa salário negativo e aceita zero', () => {
    expect(validarCliente({ ...CLIENTE_OK, salario: -0.01 })).toContain('Salário inválido');
    expect(validarCliente({ ...CLIENTE_OK, salario: 0 })).toEqual([]);
  });
});

describe('acesso à API de clientes', () => {
  let api;

  beforeEach(() => {
    api = criarApiFalsa();
  });

  it('cadastra e lista o cliente com id', () => {
    return cadastrarCliente(api, CLIENTE_OK)
      .then((salvo) => {
        expect(salvo.id).toBe(1);
        return listarClientes(api);
      })
      .then((lista) => expect(lista).toEqual([{ ...CLIENTE_OK, id: 1 }]));
  });

  it('recusa e não grava quando os dados são inválidos', () => {
    return cadastrarCliente(api, { ...CLIENTE_OK, nome: '' })
      .then(
        () => {
          throw new Error('deveria ter recusado');
        },
        (erro) => expect(erro.message).toContain('Nome obrigatório')
      )
      .then(() => listarClientes(api))
      .then((lista) => expect(lista).toHaveLength(0));
  });

  it('remove um cliente', () => {
    return cadastrarCliente(api, CLIENTE_OK)
      .then(() => removerCliente(api, 1))
      .then((removido) => {
        expect(removido).toBe(true);
        return listarClientes(api);
      })
      .then((lista) => expect(lista).toHaveLength(0));
  });

  it('a tela lista os clientes já cadastrados', () => {
    return cadastrarCliente(api, CLIENTE_OK).then(() => {
      const tela = criarTelaCliente(api);

      return vi.waitFor(() => {
        expect(tela.querySelector('tbody').rows[0].cells[1].textContent).toBe('Ana');
      });
    });
  });
});
