import { describe, it, expect, beforeEach } from 'vitest';
import { criarBanco } from './banco.js';
import {
  criarRepositorioUsuarios, criarTelaUsuario, estaAtivo, validarUsuario,
} from './usuario.js';

const USUARIO_OK = { login: 'ana', senha: '123', status: 1 };

describe('estaAtivo', () => {
  it('é verdadeiro só para status 1', () => {
    expect(estaAtivo({ status: 1 })).toBe(true);
    expect(estaAtivo({ status: 0 })).toBe(false);
  });
});

describe('validarUsuario', () => {
  it('aceita um usuário válido', () => {
    expect(validarUsuario(USUARIO_OK)).toEqual([]);
  });

  it('exige login e senha', () => {
    const erros = validarUsuario({ login: '', senha: '', status: 1 });

    expect(erros).toEqual(['Login obrigatório', 'Senha obrigatória']);
  });

  it('aceita apenas status 1 ou 0', () => {
    expect(validarUsuario({ ...USUARIO_OK, status: 0 })).toEqual([]);
    expect(validarUsuario({ ...USUARIO_OK, status: 2 })).toContain('Status deve ser 1 ou 0');
  });
});

describe('repositório de usuários', () => {
  let repositorio;
  let banco;

  beforeEach(() => {
    banco = criarBanco();
    repositorio = criarRepositorioUsuarios(banco);
  });

  it('cadastra e busca por login', () => {
    repositorio.cadastrar(USUARIO_OK);

    expect(repositorio.buscarPorLogin('ana')).toEqual({ ...USUARIO_OK, id: 1 });
  });

  it('devolve null quando o login não existe', () => {
    expect(repositorio.buscarPorLogin('ninguem')).toBeNull();
  });

  it('recusa login repetido', () => {
    repositorio.cadastrar(USUARIO_OK);

    expect(() => repositorio.cadastrar(USUARIO_OK)).toThrow('Login já cadastrado');
  });

  it('a tela mostra os usuários sem exibir a senha', () => {
    repositorio.cadastrar(USUARIO_OK);

    const tela = criarTelaUsuario(banco);

    expect(tela.querySelector('tbody').rows[0].textContent).not.toContain('123');
  });
});
