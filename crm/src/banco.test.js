import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarBanco } from './banco.js';

describe('banco (json-server em memória)', () => {
  let banco;

  beforeEach(() => {
    banco = criarBanco();
  });

  it('cria registros com id autoincremental começando em 1', () => {
    const primeiro = banco.criar('itens', { nome: 'A' });
    const segundo = banco.criar('itens', { nome: 'B' });

    expect(primeiro.id).toBe(1);
    expect(segundo.id).toBe(2);
  });

  it('lista uma coleção vazia como array vazio', () => {
    expect(banco.listar('nada')).toEqual([]);
  });

  it('busca por id e devolve null quando não existe', () => {
    banco.criar('itens', { nome: 'A' });

    expect(banco.buscarPorId('itens', 1)).toEqual({ nome: 'A', id: 1 });
    expect(banco.buscarPorId('itens', 99)).toBeNull();
  });

  it('atualiza só os campos informados e mantém o id', () => {
    banco.criar('itens', { nome: 'A', cor: 'azul' });

    const atualizado = banco.atualizar('itens', 1, { nome: 'Z', id: 50 });

    expect(atualizado).toEqual({ nome: 'Z', cor: 'azul', id: 1 });
    expect(banco.atualizar('itens', 99, { nome: 'X' })).toBeNull();
  });

  it('remove um registro e informa se ele existia', () => {
    banco.criar('itens', { nome: 'A' });

    expect(banco.remover('itens', 1)).toBe(true);
    expect(banco.remover('itens', 1)).toBe(false);
    expect(banco.listar('itens')).toHaveLength(0);
  });

  it('não reutiliza o id de um registro removido que não era o último', () => {
    banco.criar('itens', { nome: 'A' });
    banco.criar('itens', { nome: 'B' });
    banco.remover('itens', 1);

    expect(banco.criar('itens', { nome: 'C' }).id).toBe(3);
  });

  it('devolve cópias: mudar o retorno não altera o banco', () => {
    banco.criar('itens', { nome: 'A' });

    banco.listar('itens')[0].nome = 'alterado';

    expect(banco.buscarPorId('itens', 1).nome).toBe('A');
  });

  it('avisa aoMudar a cada gravação (mock)', () => {
    const aoMudar = vi.fn();
    const comAviso = criarBanco({ aoMudar });

    comAviso.criar('itens', { nome: 'A' });

    expect(aoMudar).toHaveBeenCalledTimes(1);
    expect(aoMudar).toHaveBeenCalledWith({ itens: [{ nome: 'A', id: 1 }] });
  });
});
