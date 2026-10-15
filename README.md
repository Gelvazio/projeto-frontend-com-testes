# projeto-frontend-com-testes

Projeto único que mescla os projetos dos alunos (IMC, lâmpada, modo escuro e loja com
carrinho). Detalhes da mescla: [`../SUGESTAO-PROJETO.md`](../SUGESTAO-PROJETO.md).

## Padrão do código

JavaScript **ES6 sem módulos**, no mesmo padrão dos projetos dos alunos: `let`/`const`, arrow
functions e template strings, carregados por `<script>` comum (sem `import`/`export`). A ordem
dos scripts no `index.html` importa: `imc`, `lampada`, `carrinho`, `dados-produtos`, `tema` e
por último `app`.

## Como abrir

Não precisa de servidor: abra o `index.html` direto no navegador (ou use o Live Server).

## Onde ficam os testes (para a Aula 03)

Este projeto **não traz arquivos de teste**; eles serão escritos ao vivo na aula. A lógica está
pronta para isso, em funções puras e exportadas, sem `document` nem `alert`:

| Arquivo | Funções |
|---|---|
| `js/imc.js` | `calcularImc`, `classificarImc` |
| `js/lampada.js` | `proximoEstadoLampada` |
| `js/carrinho.js` | `adicionarAoCarrinho`, `removerDoCarrinho`, `calcularTotal`, `contarItens` |
| `js/carrinho.js` | `filtrarProdutos`, `formatarPreco` |
| `js/tema.js` | `alternarTema`, `rotuloBotaoTema` |

Sem `export`, o fim de cada arquivo tem um `module.exports` condicional (só existe no Node,
e o `package.json` desta pasta o deixa em CommonJS): nos testes use
`const { calcularImc } = require('./imc.js');`.

Convenção (slide 13): `imc.test.js` ao lado de `imc.js`. `js/app.js` é a única parte que toca
a tela.
