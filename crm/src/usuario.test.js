import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarApiFalsa } from './api-falsa.js';
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
  let api;

  beforeEach(() => {
    api = criarApiFalsa();
    repositorio = criarRepositorioUsuarios(api);
  });

  it('cadastra e busca por login', () => {
    return repositorio
      .cadastrar(USUARIO_OK)
      .then(() => repositorio.buscarPorLogin('ana'))
      .then((usuario) => expect(usuario).toEqual({ ...USUARIO_OK, id: 1 }));
  });

  it('devolve null quando o login não existe', () => {
    return repositorio.buscarPorLogin('ninguem').then((usuario) => expect(usuario).toBeNull());
  });

  it('recusa login repetido', () => {
    return repositorio
      .cadastrar(USUARIO_OK)
      .then(() => repositorio.cadastrar(USUARIO_OK))
      .then(
        () => {
          throw new Error('deveria ter recusado');
        },
        (erro) => expect(erro.message).toBe('Login já cadastrado')
      );
  });

  it('a tela mostra os usuários sem exibir a senha', () => {
    return repositorio.cadastrar(USUARIO_OK).then(() => {
      const tela = criarTelaUsuario(api);

      return vi.waitFor(() => {
        const linha = tela.querySelector('tbody').rows[0];
        expect(linha.textContent).toContain('ana');
        expect(linha.textContent).not.toContain('123');
      });
    });
  });
});
