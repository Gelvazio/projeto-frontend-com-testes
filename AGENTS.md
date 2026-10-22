# AGENTS.md — projeto-frontend-com-testes

Porta de entrada das regras para **todas as IAs**. Projeto: mescla dos projetos dos alunos (IMC,
lâmpada, loja, tema) com testes em Vitest, mais o mini-CRM da atividade em `crm/`.

## Regras globais (rules-local)

No início da sessão, antes do primeiro pedido, rode na raiz do projeto:

```
node rules-local/sessao.mjs
```

Leia as linhas que começam com `rules-local:`:

- `versão igual`, `sem acesso`, `nuvem inconsistente` ou `outra sessão`: siga o pedido.
- `DISPARAR A SINCRONIZAÇÃO DE TASKS`: faça a sincronização de tasks antes do pedido, como manda
  `rules-local/regras/rules-local.md`.

Não edite a pasta `rules-local/` à mão. Ela é gerada pelo script. As regras estão em
`rules-local/regras/` (índice: `rules-local/regras/INDEX.md`).

## Quadro de tarefas

- Quadro: [`tasks/STATUS.md`](tasks/STATUS.md) · concluídas: [`tasks/task_complete.md`](tasks/task_complete.md)
  · etapas: [`tasks/etapas/`](tasks/etapas/) · recados: [`tasks/RECADOS.md`](tasks/RECADOS.md).
- Ciclo, níveis, reserva e modelos: `rules-local/regras/ciclo-da-task.md`,
  `niveis-e-modelos.md`, `frentes-e-reserva.md` e `quadro-de-tarefas.md`.

## Regras do projeto

- Trabalho direto na `main`; commit por subtarefa entregue, com o quadro no mesmo commit; sem
  `git add .`, sem `--force`. Regras de git: `rules-local/regras/git-geral.md`.
- Não abrir navegador para validar; testes novos só ao corrigir bug (exceto quando a tarefa pedir
  testes como conteúdo da atividade). Regra: `rules-local/regras/testes-validacao.md`.
- Código: SOLID, nomes em português sem acento, funções ≤ 45 linhas, arquivos ≤ 1000 linhas.
- Ao finalizar uma tarefa: commit + push, e responder só **TAREFA FINALIZADA E SINCRONIZADA!**.
