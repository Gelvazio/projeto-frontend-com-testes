import { describe, it, expect, vi } from 'vitest';
import { ITENS_MENU, marcarAtivo, montarMenu } from './menu.js';

describe('menu', () => {
  it('cria um botão para cada item, na ordem', () => {
    const menu = montarMenu(ITENS_MENU, vi.fn());

    const rotulos = [...menu.querySelectorAll('button')].map((botao) => botao.textContent);

    expect(rotulos).toEqual(['Clientes', 'Produtos', 'Pedidos', 'Usuários', 'Sair']);
  });

  it('avisa o id do item clicado (mock)', () => {
    const aoSelecionar = vi.fn();
    const menu = montarMenu(ITENS_MENU, aoSelecionar);

    menu.querySelector('[data-tela=produtos]').click();

    expect(aoSelecionar).toHaveBeenCalledWith('produtos');
  });

  it('marca só o item clicado como ativo', () => {
    const menu = montarMenu(ITENS_MENU, vi.fn());

    menu.querySelector('[data-tela=clientes]').click();
    menu.querySelector('[data-tela=pedidos]').click();

    expect(menu.querySelectorAll('[aria-current=page]')).toHaveLength(1);
    expect(menu.querySelector('[data-tela=pedidos]').getAttribute('aria-current')).toBe('page');
  });

  it('marcarAtivo com id inexistente deixa nenhum item ativo', () => {
    const menu = montarMenu(ITENS_MENU, vi.fn());
    marcarAtivo(menu, 'clientes');

    marcarAtivo(menu, 'inexistente');

    expect(menu.querySelectorAll('[aria-current]')).toHaveLength(0);
  });
});
