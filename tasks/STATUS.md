# STATUS — Projeto Frontend com Testes

**Objetivo:** mescla dos projetos dos alunos com testes em Vitest e o mini-CRM da atividade (`crm/`).
**Partes interessadas:** Gelvazio (decide, aprova e usa) · agentes de IA executam pelo quadro.
**Links:** [Regras](../AGENTS.md) · [Etapas](etapas/) · [Concluídas](task_complete.md) · [Recados](RECADOS.md)

Legenda: ⬜ Pendente · 🔄 Em progresso · ✅ Concluído · ⛔ Bloqueado · 👀 Aguardando o usuário ·
Prioridade: 🔴 Máxima · 🟠 Alta · 🟡 Média · 🟢 Baixa

## 🧭 Frentes de trabalho

| Frente | Tarefa (etapa) | Situação | Atualizado em |
|---|---|---|---|
| Claude Code (Sonnet 5.5) (local · main) | — | ⏹️ Encerrada | 2026-10-22 |

## 📌 Tarefas

Aqui só ficam tarefas **abertas ou em andamento**; linha que vira ✅ vai para o
[`task_complete.md`](task_complete.md).

| Tarefa | Título | Prioridade | Modelo | Depende de | Status | Em uso por | Etapa |
|---|---|---|---|---|---|---|---|
| **COMMIT.INICIAL.RULES-AI** | **Commit e push inicial do quadro com a tarefa COMMIT.INICIAL.RULES-AI (mudança em massa em 5 repositórios)** | 🟡 Média | — | Nenhuma | ⬜ Pendente | — (não reservável) | [ETAPA-006](etapas/ETAPA-006-d21bd368-COMMIT-INICIAL-RULES-AI.md) |
| COMMIT.INICIAL.RULES-AI.1 | Registrar a tarefa no quadro, commit e push na `main` · `PESADO · effort high` | 🟡 Média | PESADO · só Sonnet, Opus 5.5+ ou Fable · effort high | Nenhuma | ⬜ Pendente | — | [ETAPA-006](etapas/ETAPA-006-d21bd368-COMMIT-INICIAL-RULES-AI.md) |

## Escopo do projeto

- **Entra:** o app (IMC, lâmpada, loja, tema), seus testes em Vitest e o CRM em `crm/`.
- **Não entra:** a definir com o usuário a cada nova tarefa.

## 🗂️ Etapas

| Etapa | Assunto | Arquivo |
|---|---|---|
| 001-3b9e61d4 | CRM: atividade SA com projeto Vite de CRM | [ETAPA-001-3b9e61d4-CRM-ATIVIDADE.md](etapas/ETAPA-001-3b9e61d4-CRM-ATIVIDADE.md) |
| 002-5d7a2c80 | MENU: botão COVERAGE com modal | [ETAPA-002-5d7a2c80-MENU-COVERAGE.md](etapas/ETAPA-002-5d7a2c80-MENU-COVERAGE.md) |
| 003-8c4f17a9 | CRMPDF: botão Exportar PDF na atividade do CRM | [ETAPA-003-8c4f17a9-CRM-PDF.md](etapas/ETAPA-003-8c4f17a9-CRM-PDF.md) |
| 004-6e2d9b35 | CRMAPI: json-server real e menu Config no CRM | [ETAPA-004-6e2d9b35-CRM-JSON-SERVER.md](etapas/ETAPA-004-6e2d9b35-CRM-JSON-SERVER.md) |
| 005-9a1c4e72 | CRMEX: teste de exemplo do usuario.js e página de passo a passo | [ETAPA-005-9a1c4e72-CRM-EXEMPLO-USUARIO.md](etapas/ETAPA-005-9a1c4e72-CRM-EXEMPLO-USUARIO.md) |
| 006-d21bd368 | COMMIT.INICIAL.RULES-AI: commit e push inicial do quadro | [ETAPA-006-d21bd368-COMMIT-INICIAL-RULES-AI.md](etapas/ETAPA-006-d21bd368-COMMIT-INICIAL-RULES-AI.md) |

## Riscos

| Risco | Plano B |
|---|---|
| Conferência visual do CRM e do modal não é feita pela IA (regra: sem navegador) | O usuário confere com `npm run dev` (em `crm/`) e `npm run test:coverage` |

## Bloqueios gerais (sem tarefa)

| Bloqueio | O que destrava |
|---|---|

## Registro de decisões

| Data | Decisão | Quem |
|---|---|---|
| 2026-10-22 | Quadro criado neste projeto, que passou a viver em `C:\fontes\projeto-frontend-com-testes` | Gelvazio |

## Pendências (ficou para depois)

| Item | Motivo |
|---|---|

## Lições aprendidas

| Lição | Onde virou regra |
|---|---|
