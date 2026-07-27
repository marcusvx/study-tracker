# Guia de Design — Study Tracker

## Conceito

Um instrumento de precisão, não um app de "produtividade gamificada". Quem usa esse app já é disciplinado — engenheiro estudando à noite, entre um livro técnico e uma pós. Ele não precisa de confete quando marca progresso; precisa de clareza rápida: "estou no ritmo ou não?". A referência visual não é o app de hábitos fofinho — é o painel de um instrumento: bússola, régua de cálculo, mostrador analógico. Precisão silenciosa.

Isso também evita os três clichês de design gerado por IA (fundo creme + serifa + terracota; preto + neon; jornal com hairlines) — a direção aqui é mais próxima de um **painel de instrumento em modo noturno**: superfície escura, um único accent quente (âmbar, como luz de mesa), tipografia que mistura um utilitário tabular (pros números) com um humanista neutro (pra UI).

## Paleta

| Papel | Cor | Hex |
|---|---|---|
| Fundo base | Grafite muito escuro (quase preto azulado) | `#14171A` |
| Superfície (cards) | Grafite um tom acima | `#1E2226` |
| Texto primário | Branco levemente quebrado | `#EDEEEC` |
| Texto secundário | Cinza médio | `#8B929A` |
| Accent (ação/progresso) | Âmbar de luz de mesa | `#E8A33D` |
| Estado "atrasado"/alerta | Terracota apagado (não vermelho puro — evita alarme excessivo) | `#C9694F` |

Uso do accent: só em barras de progresso, CTA principal, e no dial de destaque. Não usar como cor de fundo de seções — ele é instrumento de leitura, não decoração.

## Tipografia

- **Display (títulos, números grandes de progresso):** uma fonte tabular/mono com caráter técnico — **JetBrains Mono** ou **IBM Plex Mono**. Usada com moderação: nos números de ETA, contadores, e no nome do app.
- **Corpo/UI (textos, labels, botões):** um humanista neutro e legível — **Inter** ou **IBM Plex Sans**. Evitar geométricas frias tipo Poppins/Futura — não combinam com o tom "instrumento pessoal".
- **Hierarquia:** poucos tamanhos, bem definidos. Ex: 32/24/16/13px. Peso variando mais que tamanho (Medium pra UI, Semibold só em números-chave).

Pesquisar no Google Fonts: `JetBrains Mono` + `Inter` (dupla gratuita, boa performance mobile, ampla disponibilidade de pesos).

## Estilo / linguagem visual

- **Bordas:** cantos levemente arredondados (6-8px), não totalmente retos (evita o look "broadsheet") nem muito suaves (evita look "app fofo").
- **Ícones:** lineares, traço fino (1.5px), estilo outline — não usar ícones preenchidos/coloridos tipo emoji. Referência: Lucide ou Phosphor (outline).
- **Cards:** flat, sem sombra pesada — separação por cor de superfície (`#1E2226` sobre `#14171A`), não por drop-shadow.
- **Motion:** mínimo e funcional — a barra de progresso enche suavemente ao registrar, o dial de ETA gira/ajusta quando recalcula. Nada de confete, nada de bounce. Motion aqui é feedback de instrumento, não celebração.
- **Densidade:** média — não é um app minimalista vazio (tem dados reais pra mostrar: ritmo, ETA, histórico), mas cada card mostra só o essencial, sem poluir.

## Elemento-assinatura

Um **dial circular de progresso** (como o ponteiro de um instrumento analógico) em vez da barra de progresso horizontal padrão — usado no card de cada item e em destaque na tela de detalhe. O ponteiro indica "ritmo atual vs necessário": quando alinhado à zona âmbar, está no ritmo; quando cai na zona terracota, está atrasado. Esse dial é o elemento que torna o app reconhecível — todo o resto do UI é deliberadamente quieto ao redor dele.

## Referências pra pesquisar antes de prototipar

- Apps de instrumentos financeiros/dados em dark mode (ex: apps de trading, dashboards de terminal) — pela linguagem "painel", não pela paleta
- Design de painéis de carro/avião analógicos — pelo conceito de dial e leitura rápida
- Evitar como referência: apps de hábito com ilustrações fofas, gamificação com badges/streaks decorativos