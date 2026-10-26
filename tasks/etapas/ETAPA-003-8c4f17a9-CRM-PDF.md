## Etapa 003-8c4f17a9 — CRMPDF: botão Exportar PDF na atividade do CRM

**Tarefa:** CRMPDF · **Pedido em:** 2026-10-22 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "crie 1 botao de exportar em PDF nela, e no exportado siga o padrao de atividade em
C:\fontes\aulasenai, e use o visual futurista nela tb" (a "nela" é `crm/atividade-sa.html`).
**Objetivo:** exportar a atividade em PDF com o cabeçalho SENAI e os itens no padrão
CAPACIDADE / Contexto / Comando / Resposta (skill EXERCICIOS do aulasenai), com visual futurista.

### CRMPDF.1 — Botão Exportar PDF (jsPDF + autotable) com padrão SENAI e visual futurista

**Próximo passo:** nenhum — entregue.

- **Nível:** MEDIO — código com lógica em poucos arquivos, sem banco nem segurança.
- **Modelo:** só Sonnet — nunca outro
- **Descrição:** `extrairAtividade(documento)` lê a página e monta os dados; `gerarPdf(dados)`
- **JEV-AI-SUGGESTION:** NAO
  desenha o PDF A4: cabeçalho SENAI (tabela com Data, Docente, Unidade Curricular, Turma,
  Estudante, Desempenho), seções e itens em tabelas de borda fina, fundo escuro com ciano/magenta.
- **Critérios de Aceitação:** o botão baixa um PDF; o PDF tem o cabeçalho SENAI, os itens com
  rótulos em negrito e linhas de resposta; testes da extração passam; `vite build` sem erro.
- **Entrega:** commit `f232695` · **Verificação:** `vitest run src/pdf-atividade.test.js` → 7 testes passando; `vite build` ok; PDF de teste gerado por script (7 páginas, 12 seções, 4 itens). Layout visual do PDF não conferido (sem navegador nem leitor de PDF): abrir `crm/atividade-sa.html` e clicar em Exportar PDF.
