import { describe, it, expect, beforeEach } from 'vitest';
import { criarBanco } from './banco.js';
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

describe('repositório de clientes', () => {
  let banco;

  beforeEach(() => {
    banco = criarBanco();
  });

  it('cadastra e lista o cliente com id', () => {
    const salvo = cadastrarCliente(banco, CLIENTE_OK);

    expect(salvo.id).toBe(1);
    expect(listarClientes(banco)).toEqual([{ ...CLIENTE_OK, id: 1 }]);
  });

  it('lança erro e não grava quando os dados são inválidos', () => {
    expect(() => cadastrarCliente(banco, { ...CLIENTE_OK, nome: '' })).toThrow('Nome obrigatório');
    expect(listarClientes(banco)).toHaveLength(0);
  });

  it('remove um cliente', () => {
    cadastrarCliente(banco, CLIENTE_OK);

    expect(removerCliente(banco, 1)).toBe(true);
    expect(listarClientes(banco)).toHaveLength(0);
  });

  it('a tela lista os clientes já cadastrados', () => {
    cadastrarCliente(banco, CLIENTE_OK);

    const tela = criarTelaCliente(banco);

    expect(tela.querySelector('tbody').rows[0].cells[1].textContent).toBe('Ana');
  });
});
