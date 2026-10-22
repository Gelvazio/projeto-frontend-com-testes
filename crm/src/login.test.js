import { describe, it, expect, vi } from 'vitest';
import {
  autenticar, criarTelaLogin, MOTIVO_CAMPOS_VAZIOS, MOTIVO_INATIVO, MOTIVO_NAO_ENCONTRADO,
  MOTIVO_SENHA_INVALIDA,
} from './login.js';

/** Cria um repositório falso que devolve sempre o usuário informado (mock). */
function repositorioFalso(usuario) {
  return { buscarPorLogin: vi.fn().mockReturnValue(usuario) };
}

describe('autenticar', () => {
  it('aceita login e senha corretos de usuário ativo', () => {
    const usuario = { id: 1, login: 'ana', senha: '123', status: 1 };
    const repositorio = repositorioFalso(usuario);

    const resultado = autenticar('ana', '123', repositorio);

    expect(resultado).toEqual({ sucesso: true, usuario });
    expect(repositorio.buscarPorLogin).toHaveBeenCalledWith('ana');
  });

  it('recusa campos vazios sem consultar o repositório', () => {
    const repositorio = repositorioFalso(null);

    expect(autenticar('', '123', repositorio).motivo).toBe(MOTIVO_CAMPOS_VAZIOS);
    expect(autenticar('ana', '', repositorio).motivo).toBe(MOTIVO_CAMPOS_VAZIOS);
    expect(repositorio.buscarPorLogin).not.toHaveBeenCalled();
  });

  it('informa usuário não encontrado', () => {
    expect(autenticar('x', '1', repositorioFalso(null)).motivo).toBe(MOTIVO_NAO_ENCONTRADO);
  });

  it('informa senha inválida', () => {
    const repositorio = repositorioFalso({ login: 'ana', senha: '123', status: 1 });

    expect(autenticar('ana', 'errada', repositorio).motivo).toBe(MOTIVO_SENHA_INVALIDA);
  });

  it('recusa usuário inativo mesmo com a senha certa', () => {
    const repositorio = repositorioFalso({ login: 'ana', senha: '123', status: 0 });

    const resultado = autenticar('ana', '123', repositorio);

    expect(resultado).toEqual({ sucesso: false, motivo: MOTIVO_INATIVO });
  });
});

describe('criarTelaLogin', () => {
  it('chama aoEntrar com o usuário quando o login é aceito', () => {
    const usuario = { login: 'ana', senha: '123', status: 1 };
    const aoEntrar = vi.fn();
    const tela = criarTelaLogin(aoEntrar, repositorioFalso(usuario));
    tela.querySelector('[name=login]').value = 'ana';
    tela.querySelector('[name=senha]').value = '123';

    tela.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(aoEntrar).toHaveBeenCalledWith(usuario);
  });

  it('mostra o motivo quando o login é recusado', () => {
    const tela = criarTelaLogin(vi.fn(), repositorioFalso(null));
    tela.querySelector('[name=login]').value = 'x';
    tela.querySelector('[name=senha]').value = '1';

    tela.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));

    expect(tela.querySelector('.mensagem').textContent).toBe(MOTIVO_NAO_ENCONTRADO);
  });
});
