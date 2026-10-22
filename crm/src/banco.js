/**
 * "json-server" de mentira: guarda coleções de registros em memória, com a mesma ideia
 * de rotas REST (listar, buscar, criar, atualizar, remover). Nada vai para banco real.
 */

const ID_INICIAL = 1;

/**
 * Cria um banco em memória.
 * @param {{dadosIniciais?: object, aoMudar?: (dados: object) => void}} [opcoes]
 *   dadosIniciais: coleções já existentes; aoMudar: chamado após cada gravação (persistência).
 * @returns {object} Banco com listar, buscarPorId, criar, atualizar, remover e exportar.
 */
export function criarBanco({ dadosIniciais = {}, aoMudar = () => {} } = {}) {
  const dados = structuredClone(dadosIniciais);

  /** @param {string} colecao - Nome da coleção. @returns {object[]} Lista (cria se não existe). */
  function obterColecao(colecao) {
    if (!dados[colecao]) dados[colecao] = [];
    return dados[colecao];
  }

  /** @param {object[]} lista - Lista atual. @returns {number} Próximo id livre. */
  function proximoId(lista) {
    const maiorId = lista.reduce((maior, registro) => Math.max(maior, registro.id), 0);
    return Math.max(maiorId + 1, ID_INICIAL);
  }

  return {
    listar: (colecao) => structuredClone(obterColecao(colecao)),

    buscarPorId(colecao, id) {
      const registro = obterColecao(colecao).find((item) => item.id === id);
      return registro ? structuredClone(registro) : null;
    },

    criar(colecao, registro) {
      const lista = obterColecao(colecao);
      const novo = { ...registro, id: proximoId(lista) };
      lista.push(novo);
      aoMudar(structuredClone(dados));
      return structuredClone(novo);
    },

    atualizar(colecao, id, campos) {
      const registro = obterColecao(colecao).find((item) => item.id === id);
      if (!registro) return null;
      Object.assign(registro, campos, { id });
      aoMudar(structuredClone(dados));
      return structuredClone(registro);
    },

    remover(colecao, id) {
      const lista = obterColecao(colecao);
      const posicao = lista.findIndex((item) => item.id === id);
      if (posicao === -1) return false;
      lista.splice(posicao, 1);
      aoMudar(structuredClone(dados));
      return true;
    },

    exportar: () => structuredClone(dados),
  };
}
