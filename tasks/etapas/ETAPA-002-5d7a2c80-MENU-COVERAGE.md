## Etapa 002-5d7a2c80 — MENU: botão COVERAGE com modal

**Tarefa:** MENU · **Pedido em:** 2026-10-22 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "adicione 1 botao de nome COVERAGE no menu, que deve abrir ... coverage/index.html" →
"mude pra abrir como modal".
**Objetivo:** abrir o relatório de cobertura dentro de um modal na tela do projeto.

### MENU.1 — Botão COVERAGE com modal (dialog + iframe)

**Próximo passo:** nenhum — entregue.

- **Nível:** LEVE — 3 arquivos pequenos (HTML, CSS e JS), sem lógica de negócio.
- **Modelo:** só Haiku — nunca outro
- **Descrição:** botão `COVERAGE` no cabeçalho; `<dialog>` com `<iframe>` que carrega
  `coverage/index.html` na primeira abertura; fecha pelo botão ou clicando fora.
- **Critérios de Aceitação:** o botão abre o relatório no modal e o modal fecha.
- **Entrega:** commits `9fda467` e `9e64afc` · **Verificação:** `node --check js/app.js`. Visual
  não conferido no navegador: o `coverage/` precisa existir (`npm run test:coverage`).
