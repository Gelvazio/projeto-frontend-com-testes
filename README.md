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

## Rodar os testes (Vitest, Aula 03 — slides 11 e 12)

1. **Inicializar o npm:** o `package.json` desta pasta já existe (seria `npm init -y`).
2. **Instalar o Vitest:** `npm install` (instala o `vitest` listado em `devDependencies`; para
   começar do zero: `npm install -D vitest`).
3. **Scripts** no `package.json`: `test` roda o Vitest em modo watch (repete a cada salvamento) e
   `test:run` roda uma vez só, como numa esteira de CI.
4. **Executar:**

```bash
npm test
```

ou, uma vez só:

```bash
npm run test:run
```

O `"type": "commonjs"` deste `package.json` existe porque o código é ES6 **sem módulos**: os
arquivos terminam com `module.exports` condicional. Mesmo assim, os testes podem usar `import`
(o Vitest converte), como nos slides. A pasta `node_modules/` fica fora do Git (`.gitignore`).

## Onde ficam os testes (para a Aula 03)

O `js/imc.test.js` é montado um conceito por vez (tarefa TEST do quadro). A lógica está em
funções puras e exportadas, sem `document` nem `alert`:

| Arquivo | Funções |
|---|---|
| `js/imc.js` | `calcularImc`, `classificarImc` |
| `js/lampada.js` | `proximoEstadoLampada` |
| `js/carrinho.js` | `adicionarAoCarrinho`, `removerDoCarrinho`, `calcularTotal`, `contarItens` |
| `js/carrinho.js` | `filtrarProdutos`, `formatarPreco` |
| `js/tema.js` | `alternarTema`, `rotuloBotaoTema` |

Sem `export`, o fim de cada arquivo tem um `module.exports` condicional (só existe no Node,
e o `package.json` desta pasta o deixa em CommonJS): nos testes use
`import { calcularImc } from './imc.js';`.

Convenção (slide 13): `imc.test.js` ao lado de `imc.js`. `js/app.js` é a única parte que toca
a tela.
