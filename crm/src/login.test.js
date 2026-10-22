import { describe, it, expect, vi } from 'vitest';
import {
  autenticar,
  avaliarUsuario,
  criarTelaLogin,
  MOTIVO_CAMPOS_VAZIOS,
  MOTIVO_NAO_ENCONTRADO,
  MOTIVO_SENHA_INVALIDA,
  MOTIVO_INATIVO,
  USUARIO_PADRAO,
  SENHA_PADRAO,
} from './login.js';

function criarRepositorio(usuario) {
  return { buscarPorLogin: vi.fn().mockResolvedValue(usuario) };
}

const usuarioAtivo = { id: 5, login: 'maria', senha: 'segredo', status: 1 };
const usuarioInativo = { id: 6, login: 'joao', senha: 'segredo', status: 0 };

describe('autenticar', () => {
  it('aluno/aluno entra direto sem consultar o repositorio', () => {
    const repositorio = criarRepositorio(null);
    return autenticar(USUARIO_PADRAO, SENHA_PADRAO, repositorio).then((resultado) => {
      expect(resultado.sucesso).toBe(true);
      expect(resultado.usuario.login).toBe(USUARIO_PADRAO);
      expect(repositorio.buscarPorLogin).not.toHaveBeenCalled();
    });
  });

  it('campos vazios retornam o motivo sem consultar o repositorio', () => {
    const repositorio = criarRepositorio(usuarioAtivo);
    return autenticar('', '', repositorio).then((resultado) => {
      expect(resultado).toEqual({ sucesso: false, motivo: MOTIVO_CAMPOS_VAZIOS });
      expect(repositorio.buscarPorLogin).not.toHaveBeenCalled();
    });
  });

  it('usuario nao encontrado', () => {
    return autenticar('ninguem', 'x', criarRepositorio(null)).then((resultado) => {
      expect(resultado).toEqual({ sucesso: false, motivo: MOTIVO_NAO_ENCONTRADO });
    });
  });

  it('senha invalida', () => {
    return autenticar('maria', 'errada', criarRepositorio(usuarioAtivo)).then((resultado) => {
      expect(resultado).toEqual({ sucesso: false, motivo: MOTIVO_SENHA_INVALIDA });
    });
  });

  it('usuario inativo com senha certa', () => {
    return autenticar('joao', 'segredo', criarRepositorio(usuarioInativo)).then((resultado) => {
      expect(resultado).toEqual({ sucesso: false, motivo: MOTIVO_INATIVO });
    });
  });

  it('usuario comum ativo com senha certa entra', () => {
    const repositorio = criarRepositorio(usuarioAtivo);
    return autenticar('maria', 'segredo', repositorio).then((resultado) => {
      expect(resultado).toEqual({ sucesso: true, usuario: usuarioAtivo });
      expect(repositorio.buscarPorLogin).toHaveBeenCalledWith('maria');
    });
  });

  it('aluno com senha errada nao entra direto e cai no repositorio', () => {
    const repositorio = criarRepositorio(null);
    return autenticar('aluno', 'errada', repositorio).then((resultado) => {
      expect(repositorio.buscarPorLogin).toHaveBeenCalledWith('aluno');
      expect(resultado).toEqual({ sucesso: false, motivo: MOTIVO_NAO_ENCONTRADO });
    });
  });
});

describe('avaliarUsuario', () => {
  it.each([
    [null, 'x', { sucesso: false, motivo: MOTIVO_NAO_ENCONTRADO }],
    [usuarioAtivo, 'errada', { sucesso: false, motivo: MOTIVO_SENHA_INVALIDA }],
    [usuarioInativo, 'segredo', { sucesso: false, motivo: MOTIVO_INATIVO }],
    [usuarioAtivo, 'segredo', { sucesso: true, usuario: usuarioAtivo }],
  ])('avalia %o com senha %s', (usuario, senha, esperado) => {
    expect(avaliarUsuario(usuario, senha)).toEqual(esperado);
  });
});

describe('criarTelaLogin', () => {
  function enviarFormulario(tela, login, senha) {
    document.body.appendChild(tela);
    tela.querySelector('[name=login]').value = login;
    tela.querySelector('[name=senha]').value = senha;
    tela.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
  }

  it('chama aoEntrar com o usuario no sucesso', () => {
    const aoEntrar = vi.fn();
    const tela = criarTelaLogin(aoEntrar, criarRepositorio(usuarioAtivo));
    enviarFormulario(tela, 'maria', 'segredo');
    return vi.waitFor(() => expect(aoEntrar).toHaveBeenCalledWith(usuarioAtivo));
  });

  it('mostra o motivo na mensagem na recusa', () => {
    const aoEntrar = vi.fn();
    const tela = criarTelaLogin(aoEntrar, criarRepositorio(null));
    enviarFormulario(tela, 'ninguem', 'x');
    return vi
      .waitFor(() => {
        expect(tela.querySelector('.mensagem').textContent).toBe(MOTIVO_NAO_ENCONTRADO);
      })
      .then(() => expect(aoEntrar).not.toHaveBeenCalled());
  });

  it('mostra o erro do repositorio na mensagem', () => {
    const repositorio = { buscarPorLogin: vi.fn().mockRejectedValue(new Error('Sem banco')) };
    const tela = criarTelaLogin(vi.fn(), repositorio);
    enviarFormulario(tela, 'maria', 'segredo');
    return vi.waitFor(() => {
      expect(tela.querySelector('.mensagem').textContent).toBe('Sem banco');
    });
  });

  it('tem login, senha e botao empilhados no formulario centralizado', () => {
    const tela = criarTelaLogin(vi.fn(), criarRepositorio(null));
    const filhos = [...tela.querySelector('form.formulario--centralizado').children];
    expect(filhos[0].querySelector('[name=login]')).not.toBeNull();
    expect(filhos[1].querySelector('[name=senha]')).not.toBeNull();
    expect(filhos[2].tagName).toBe('BUTTON');
    expect(filhos).toHaveLength(3);
  });
});
