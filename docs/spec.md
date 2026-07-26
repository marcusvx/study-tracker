Aqui vai uma descrição pronta pra colar no Figma (funciona bem pro Figma Make/First Draft ou como briefing pra prototipagem manual):

---

**App: Ritmo de Estudos**

App mobile (PWA/iOS) para acompanhar múltiplas frentes de estudo em paralelo — livros técnicos, certificações, cursos, leituras de trabalho — com metas de tempo, progresso e previsão de conclusão.

**Estilo visual:** clean, minimalista, tons neutros com um accent color vibrante (ex: azul ou verde) usado só em progresso/CTAs. Tipografia legível, cards com bastante respiro, ícones simples (categoria por ícone: livro, certificado, cadeado de código, maleta de trabalho). Foco em rapidez de uso — nada de fricção pra registrar progresso.

**Telas:**

1. **Dashboard (home)**
   - Lista de cards, um por item de estudo
   - Cada card: título, categoria (ícone + tag colorida), barra de progresso, "ritmo atual vs necessário" (ex: "no ritmo, conclui em 12 dias" ou alerta "atrasado"), botão rápido "+ registrar hoje"
   - Filtro/toggle no topo: Todos / Ativos / Pausados / Concluídos
   - FAB (botão flutuante) "+" pra criar novo item

2. **Registrar progresso (modal/bottom sheet)**
   - Aberto ao tocar "+ registrar" no card
   - Campos: quanto avançou (número + unidade do item), minutos gastos, nota opcional
   - Botão grande "Salvar" — deve ser possível concluir em 2 toques

3. **Detalhe do item**
   - Header: título, categoria, escopo total, meta de prazo
   - Gráfico simples de progresso ao longo do tempo (linha ou barras)
   - ETA calculado em destaque (previsão atual vs meta original)
   - Configuração de plano: cadência (diário / a cada X dias), tempo por sessão, horário do lembrete
   - Histórico de registros (lista cronológica)
   - Botões: editar, pausar, arquivar

4. **Criar/editar item**
   - Form: título, categoria (seletor com ícones), escopo total + unidade (páginas, %, horas, módulos), meta de prazo (opcional), cadência, tempo por sessão, horário do lembrete
   - Toggle de notificação on/off

5. **Configurações**
   - Gerenciar notificações
   - Login/conta (Supabase Auth)

**Componentes-chave a prototipar:** card de item com barra de progresso, bottom sheet de registro rápido, gráfico de progresso, seletor de cadência (diário/a cada X dias).

---

Quer que eu ajuste o tom (mais corporativo/sério vs mais leve) ou detalhe alguma tela específica antes de você colar?