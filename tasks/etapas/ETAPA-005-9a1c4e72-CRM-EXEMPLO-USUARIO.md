## Etapa 005-9a1c4e72 — CRMEX: teste de exemplo do usuario.js e página de passo a passo

**Tarefa:** CRMEX · **Pedido em:** 2026-10-22 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "Crie de forma detalhada e explicativa, o teste de 1 arquivo pra os alunos seguirem como
exemplo em atividade-sa.html, pode ser do arquivo usuario.js, e coloque no inicio ao lado do BOTAO
EXPORTAR PDF, UM BOTAO DE NOME TESTE DE EXEMPLO USUARIO, que deve abrir uma pagina em nova guia com
1 passo a passo de como fazer tudo que foi pedido para o usuario.js".
**Objetivo:** dar aos alunos um modelo completo de teste (`usuario.js`) e um passo a passo para
repeti-lo nos demais arquivos do CRM.

### CRMEX.1 — Teste de exemplo comentado, página exemplo-usuario.html e botão na atividade

**Próximo passo:** nenhum — entregue.

- **Nível:** MEDIO — 1 teste, 1 página e ajustes em 2 arquivos, sem banco novo nem segurança.
- **Modelo:** só Sonnet — nunca outro
- **Descrição:** `src/usuario.exemplo.test.js` (18 testes, comentado por passos: AAA, matchers,
  `it.each`, `beforeEach`, promessas com `.then` e `return`, mock com `vi.fn`, jsdom e
  `vi.waitFor`); `exemplo-usuario.html` com 12 passos (ambiente, leitura do código, plano de casos,
  imports, cada grupo de testes, rodar, mutante sobrevivente e checklist) usando trechos copiados do
  arquivo de exemplo; botão `TESTE DE EXEMPLO USUARIO` ao lado do Exportar PDF, em nova guia.
- **Critérios de Aceitação:** o botão abre a página em nova guia; os trechos da página são
  idênticos ao código de origem; o teste de exemplo passa; a página entra no `vite build`.
- **Entrega:** commit da etapa (ver `git log`, CRMEX.1) · **Verificação:** `vitest run` → 13 arquivos, 129 testes passando (inclui 18 do exemplo e o teste que garante que os trechos da página são idênticos ao código); 3 mutantes aplicados em `usuario.js` fazem os testes falharem como a página descreve (arquivo restaurado); `vite build` inclui `exemplo-usuario.html`. Visual da página e do botão não conferidos no navegador (regra do usuário): abrir `atividade-sa.html` e clicar em TESTE DE EXEMPLO USUARIO. Atenção: o botão Exportar PDF usa módulos npm e só funciona com `npm run dev` (Vite), não com o Live Server puro.
