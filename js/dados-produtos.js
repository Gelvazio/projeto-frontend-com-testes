/**
 * Produtos da loja de demonstração (inspirada na loja de marcosvpaz-svg).
 * Usa emoji no lugar de imagens para não depender de arquivos externos.
 */

const CATEGORIAS = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'masculino', rotulo: 'Masculino' },
  { valor: 'feminino', rotulo: 'Feminino' },
  { valor: 'acessorios', rotulo: 'Acessórios' },
  { valor: 'esportes', rotulo: 'Esportes' },
];

const PRODUTOS = [
  { id: 1, nome: 'Camisa Polo Azul', preco: 129.9, categoria: 'masculino', icone: '👕' },
  { id: 2, nome: 'Camisa do Time', preco: 299, categoria: 'esportes', icone: '⚽' },
  { id: 3, nome: 'Vestido Floral', preco: 189.5, categoria: 'feminino', icone: '👗' },
  { id: 4, nome: 'Tênis Esportivo Branco', preco: 149.9, categoria: 'esportes', icone: '👟' },
  { id: 5, nome: 'Boné Preto', preco: 59.9, categoria: 'acessorios', icone: '🧢' },
  { id: 6, nome: 'Mochila Escolar', preco: 99, categoria: 'acessorios', icone: '🎒' },
  { id: 7, nome: 'Calça Jeans', preco: 159.9, categoria: 'masculino', icone: '👖' },
  { id: 8, nome: 'Bolsa de Couro', preco: 219.9, categoria: 'feminino', icone: '👜' },
];

/* Permite importar as funções nos testes (Node); no navegador não existe `module`. */
if (typeof module !== 'undefined') {
  module.exports = {
    CATEGORIAS,
    PRODUTOS,
  };
}
