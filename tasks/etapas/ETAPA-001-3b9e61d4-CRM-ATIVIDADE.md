## Etapa 001-3b9e61d4 — CRM: atividade SA com projeto Vite de CRM

**Tarefa:** CRM · **Pedido em:** 2026-10-22 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "CRIE 1 ATIVIDADE EM HTML, sem colocar nada no banco de dados, sendo ela um projeto
simples com cliente, produto e venda ... numa pasta de nome crm ... projeto vite ... um teste pra
cada arquivo ... sem await ... layout de Situação de Aprendizagem" (base: AULA-03 e o modelo
`Modelo Plano de Ensino_ SA`). Visual futurista (`rules-ai/prompts/VISUAL-FUTURISTA.md`) só no CRM.
**Objetivo:** entregar o mini-CRM em `crm/` e a atividade `atividade-sa.html` no layout de
Situação de Aprendizagem, para a Aula 03 (testes unitários).

### CRM.1 — Projeto Vite do CRM, testes por arquivo e atividade SA

**Próximo passo:** nenhum — entregue.

- **Nível:** MEDIO — vários arquivos de código, sem banco real nem segurança.
- **Modelo:** só Sonnet — nunca outro
- **Descrição:** `banco.js` (lógica de json-server em memória), `cliente.js`, `produto.js`,
- **JEV-AI-SUGGESTION:** NAO
  `pedido.js`, `usuario.js` (id, login, senha, status 1/0), `login.js`, `menu.js`, `tela.js`,
  `main.js`, `index.html`, `estilo.css` (cyberpunk) e um `.test.js` por arquivo; sem `async`/`await`.
- **Critérios de Aceitação:** 8 arquivos de teste passando; `vite build` sem erro; nenhum `await`.
- **Entrega:** commit `da419c3` · **Verificação:** `npx vitest run` → 8 arquivos, 65 testes
  passando; `vite build` ok; busca por `await|async` em `src/` sem resultado. Visual não conferido
  no navegador (regra do usuário): conferir com `npm run dev` dentro de `crm/`.
- **Anotação:** testes novos autorizados pelo usuário por serem o conteúdo da atividade.
