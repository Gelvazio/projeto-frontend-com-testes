/**
 * Serviço assíncrono do IMC: busca peso e altura de uma pessoa por uma função injetada
 * (ex.: uma API) e calcula o IMC. Criado para a Aula 03 ensinar mock de função assíncrona
 * (slides 32 e 33); não é usado pela tela (index.html).
 * A busca chega por parâmetro (injeção de dependência): no teste, ela vira um vi.fn().
 */

const MSG_BUSCA_INVALIDA = 'buscarPessoa precisa ser uma função.';
const MSG_PESSOA_NAO_ENCONTRADA = 'Pessoa não encontrada.';

/* No navegador, calcularImc já é global (imc.js vem antes); no Node, vem do require. */
const calcularImcDoServico =
  typeof require === 'function' ? require('./imc.js').calcularImc : calcularImc;

/**
 * Busca uma pessoa e devolve o IMC dela.
 * @param {(id: number) => Promise<{peso: number, altura: number}|null>} buscarPessoa -
 *   Função assíncrona que busca a pessoa pelo id (ex.: chamada a uma API).
 * @param {number} id - Identificador da pessoa.
 * @returns {Promise<number|null>} IMC da pessoa, ou null se peso/altura forem inválidos.
 * @throws {TypeError} Se buscarPessoa não for uma função.
 * @throws {Error} Se a pessoa não existir, ou o erro da própria busca (ex.: servidor recusou).
 */
async function obterImcDaPessoa(buscarPessoa, id) {
  if (typeof buscarPessoa !== 'function') throw new TypeError(MSG_BUSCA_INVALIDA);

  const pessoa = await buscarPessoa(id);
  if (!pessoa) throw new Error(MSG_PESSOA_NAO_ENCONTRADA);

  return calcularImcDoServico(pessoa.peso, pessoa.altura);
}

/* Permite importar as funções nos testes (Node); no navegador não existe `module`. */
if (typeof module !== 'undefined') {
  module.exports = {
    MSG_BUSCA_INVALIDA,
    MSG_PESSOA_NAO_ENCONTRADA,
    obterImcDaPessoa,
  };
}
