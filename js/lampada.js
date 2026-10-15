/**
 * Máquina de estados da lâmpada (lógica pura, sem DOM).
 * Origem: lampada de carlosdanielramosleandro43-ctrl e JavaScript de marcosxz447l.
 */

const ESTADO_APAGADA = 'apagada';
const ESTADO_ACESA = 'acesa';
const ESTADO_QUEBRADA = 'quebrada';

const EVENTO_LIGAR = 'ligar';
const EVENTO_DESLIGAR = 'desligar';
const EVENTO_MOUSE_ENTRAR = 'mouse-entrar';
const EVENTO_MOUSE_SAIR = 'mouse-sair';
const EVENTO_DUPLO_CLIQUE = 'duplo-clique';

/** Eventos de mouse invertem o estado (comportamento do projeto original). */
const EVENTOS_QUE_INVERTEM = [EVENTO_MOUSE_ENTRAR, EVENTO_MOUSE_SAIR];

/**
 * Inverte entre acesa e apagada.
 * @param {string} estado - Estado atual (apagada ou acesa).
 * @returns {string} Estado oposto.
 */
function inverterEstado(estado) {
  return estado === ESTADO_ACESA ? ESTADO_APAGADA : ESTADO_ACESA;
}

/**
 * Calcula o estado seguinte da lâmpada.
 * @param {string} estadoAtual - apagada, acesa ou quebrada.
 * @param {string} evento - Um dos EVENTO_* exportados.
 * @returns {string} Novo estado. Uma lâmpada quebrada nunca muda.
 */
function proximoEstadoLampada(estadoAtual, evento) {
  if (estadoAtual === ESTADO_QUEBRADA) return ESTADO_QUEBRADA;
  if (evento === EVENTO_DUPLO_CLIQUE) return ESTADO_QUEBRADA;
  if (evento === EVENTO_LIGAR) return ESTADO_ACESA;
  if (evento === EVENTO_DESLIGAR) return ESTADO_APAGADA;
  if (EVENTOS_QUE_INVERTEM.indexOf(evento) !== -1) return inverterEstado(estadoAtual);

  return estadoAtual;
}

/* Permite importar as funções nos testes (Node); no navegador não existe `module`. */
if (typeof module !== 'undefined') {
  module.exports = {
    ESTADO_APAGADA,
    ESTADO_ACESA,
    ESTADO_QUEBRADA,
    EVENTO_LIGAR,
    EVENTO_DESLIGAR,
    EVENTO_MOUSE_ENTRAR,
    EVENTO_MOUSE_SAIR,
    EVENTO_DUPLO_CLIQUE,
    proximoEstadoLampada,
  };
}
