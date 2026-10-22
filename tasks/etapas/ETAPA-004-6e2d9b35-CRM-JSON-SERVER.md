## Etapa 004-6e2d9b35 — CRMAPI: json-server real e menu Config no CRM

**Tarefa:** CRMAPI · **Pedido em:** 2026-10-22 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "e o banco de dados JSON server?" → json-server real (escolhido pelo usuário) e
"crie um menu de nome Config, que deve abrir um modal, e permitir colocar o caminho do banco de
dados local".
**Objetivo:** o CRM passa a falar com um json-server de verdade (`db.json`), sem `await`, e o menu
Config permite informar o endereço (caminho) desse banco local.

**Decisões:**
- Pacote `json-server@0.17.4` (ids numéricos, igual aos testes atuais). `db.json` é só de exercício,
  local, sem produção, sem segurança e sem SQL: por isso a classificação abaixo é MEDIO, não PESADO
  (o Jev sinalizou PESADO pela palavra "banco"; **revisão humana recomendada**).
- No navegador não existe "caminho de arquivo" para o `db.json`: o **caminho** que o Config guarda é
  o **endereço do json-server** (ex.: `http://localhost:3000`), salvo no `localStorage`. O arquivo
  `db.json` é lido pelo script `npm run api`.
- Sem `async`/`await` e sem `new Promise`: `fetch(...).then(...)`. O usuário pediu "não pode usar
  promessas" e logo depois "use fetch api"; como o `fetch` devolve Promise por natureza, ficou o
  `fetch` encadeado com `.then`. Testes mockam o `fetch` e usam `api-falsa.js` em memória.
- Login: usuário `aluno` / senha `aluno` entra direto, sem consultar o banco (pedido do usuário);
  tela de login com Usuário, Senha e botão empilhados e centralizados.
- Execução: 3 agentes `executor-medio` em paralelo (pedido; login e CSS; Config), a pedido do
  usuário; integração (`main.js`) e conferências feitas pelo líder.

### CRMAPI.1 — api.js (cliente do json-server) e telas usando promessas

**Próximo passo:** nenhum — entregue.

- **Nível:** MEDIO — vários arquivos de código, banco local de exercício (ver Decisões).
- **Modelo:** só Sonnet — nunca outro
- **Descrição:** `api.js` com listar/buscarPorId/criar/atualizar/remover sobre as rotas REST do
  json-server; módulos de domínio devolvem promessas; ajuda de teste `api-falsa.js` em memória.
- **Critérios de Aceitação:** `npm run api` sobe o json-server com `db.json`; testes passam sem
  `await`; `vite build` sem erro.
- **Entrega:** commit da etapa (ver `git log`, CRMAPI.1) · **Verificação:** `vitest run` → 11 arquivos, 107 testes passando; `vite build` ok; sem `async`/`await`/`new Promise` em `src/`; json-server real subiu (`GET /usuarios` e `POST /clientes` responderam; o cliente de teste foi removido do `db.json`). Visual e fluxo no navegador não conferidos (sem navegador): `npm run api` + `npm run dev`.

### CRMAPI.2 — Menu Config com modal para o endereço do banco local

**Próximo passo:** nenhum — entregue.

- **Nível:** MEDIO — tela com estado salvo no navegador, 3 a 4 arquivos.
- **Modelo:** só Sonnet — nunca outro
- **Depende de:** CRMAPI.1
- **Descrição:** item `Config` no menu abre um `<dialog>` com campo "Caminho do banco de dados
  local" (URL do json-server), botões Salvar e Testar conexão; valor salvo em `localStorage` e
  lido por `api.js`; padrão `http://localhost:3000`.
- **Critérios de Aceitação:** o modal abre pelo menu, grava e carrega o endereço, recusa URL
  inválida; testes do módulo de configuração passam.
- **Entrega:** mesmo commit de CRMAPI.1 · **Verificação:** `config.test.js` (17) e `menu.test.js` (4) passando; item Config ligado ao modal em `main.js`. Modal não conferido no navegador.
