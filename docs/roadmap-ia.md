# Roadmap — Diferencial de IA (PI4)

**Status:** planejado, aguardando início do Sprint 1
**Execução:** as 29 issues derivadas deste roadmap — com critérios de aceite, labels, estimativa e dependências — estão em [`backlog-pi4.md`](./backlog-pi4.md). A direção de produto para além do PI4 está em [`visao-produto.md`](./visao-produto.md).
**Contexto:** o MVP atual (fila + reserva) resolve o problema básico, mas é funcionalmente igual a qualquer app de reserva de fila do mercado. Este roadmap define o que construir nos 4 sprints do PI4 para dar ao Deep Dish um diferencial real, usando IA de forma verificável (não cosmética).

Origem: análise do backend atual cruzada com o documento de visão "RestaurantOS AI" (rascunho gerado a partir de uma conversa com ChatGPT, sem contexto do estado atual do projeto). O documento original mira um produto de escala de startup financiada (visão computacional, microserviços Node, Kubernetes, marketplace). Este roadmap extrai apenas o que é construível em 12 semanas por uma equipe de 3-4 pessoas em cima do stack já existente (Laravel + PostgreSQL + React), sem reescrever autenticação nem introduzir infraestrutura nova desnecessária.

## Decisões tomadas

- **Sem visão computacional.** Exige câmeras físicas em restaurantes parceiros e pipeline de vídeo — fora do escopo de um semestre.
- **Sem RBAC de equipe** (login de garçom/recepcionista/limpeza) neste semestre. Hoje `Funcionario` é só um cadastro (não autenticável). Adicionar login+permissões é uma frente inteira de trabalho que competiria por tempo com o diferencial de IA. Fica como próximo passo natural pós-semestre.
- **Sem troca de auth para Sanctum.** O JWT dual-guard atual (`api`/`restaurante` via tymon/jwt-auth, com `VerifyJwtTokenVersion`) já resolve o problema; trocar seria reescrita sem ganho.
- **Sem Node/BullMQ/Redis novos.** Laravel Queues (já em uso via `queue:listen`) cobre processamento assíncrono sem introduzir um segundo runtime.
- **LLM via OpenRouter**, não API direta de um único provedor — já há acesso/chaves, mais barato, permite trocar modelo conforme custo/desempenho.
- **Assistente de IA usa tool-calling sobre dados reais** (nunca deixa o LLM "chutar" número) — a resposta vem de uma função que consulta o banco, o LLM só formata a resposta em linguagem natural.
- **Estimativa de espera é heurística estatística (média histórica condicionada), não Machine Learning treinado.** É honesto chamar de "previsão v1"; modelo evolui para ML quando houver volume real de dados de uso.
- **O produto vai para mobile neste semestre, via Capacitor — em caráter de teste.** O app é **só do cliente**; o restaurante continua no painel web, porque gestão de salão precisa de tela grande (o gerente vê muitas mesas ao mesmo tempo num tablet ou no computador do balcão). Capacitor empacota o React/Vite atual como app Android nativo — APK instalável, com push FCM e câmera para o QR — **sem reescrever nenhuma tela**. Entra como 2 issues do Sprint 3 (#22 e #23) em vez de consumir um sprint inteiro. **React Native não está descartado**: continua como alternativa, com gatilhos objetivos de reavaliação registrados no backlog futuro e detalhados na seção *Mobile* do [`backlog-pi4.md`](./backlog-pi4.md).
- **IA por voz (o sistema ligar para o restaurante) está descartada** como mecanismo central. Não elimina a ligação — transfere o custo para a plataforma; é lenta e frágil, não vira estado no banco, e tem risco regulatório de telemarketing no Brasil. O canal assíncrono (WhatsApp com IA interpretando texto livre) é a troca vencedora, e pertence ao pós-PI4.

## Achado crítico que motiva o Sprint 1

Hoje `ClienteFila` é **deletado (hard delete)** quando o cliente é promovido, cancela ou é removido da fila (`FilaService::cancelarPosicao`, `promoverProximoParaMesa`, `FilaController::removerRestaurante`). Não existe nenhum histórico de tempo de espera, taxa de abandono ou tempo de permanência. Sem isso, nenhuma das features de analytics/previsão/assistente tem dado real para usar — por isso o Sprint 1 é 100% fundação, sem "IA" nenhuma.

Sinal correlato: já existiu um campo `estimated_time` em `clientefila` (migration `2026_03_10_002939`), removido um mês depois — indício de que uma tentativa anterior de estimar espera foi abandonada, provavelmente por falta de dado para sustentar o número.

---

## Sprint 1 (semanas 1-3) — Fundação: histórico operacional

**Objetivo:** parar de perder dado. Sem "IA" visível ainda, mas é o que sustenta os 3 sprints seguintes.

- Capturar saída da fila em vez de hard delete: `status_saida` (atendido/desistiu/removido/expirado), `tempo_espera_segundos`.
- Capturar duração real de permanência em `ClienteMesa` (checkin → liberação).
- Atualizar `FilaService::cancelarPosicao`, `promoverProximoParaMesa`, `FilaController::removerRestaurante` para gravar o histórico antes de remover o registro ativo.
- Seeder de dados sintéticos (realistas) — necessário porque 12 semanas de uso real não vão gerar volume suficiente para o dashboard/assistente ficarem interessantes na apresentação final. Deixar claro na entrega o que é dado sintético vs real.
- Testes PHPUnit no `FilaService` cobrindo a escrita de histórico.

**Divisão sugerida:** 2 pessoas em backend (migration + service), 1 em testes, 1 no seeder + wireframe do dashboard do Sprint 2.

---

## Sprint 2 (semanas 4-6) — Analytics real + estimativa de espera

- `AnalyticsService`: tempo médio de espera por dia da semana/horário, taxa de abandono, ocupação, giro de mesa, mapa de calor de demanda por horário — consultando o histórico do Sprint 1.
- Estimativa de espera ao entrar na fila: média histórica condicionada a restaurante + dia + faixa de horário + tamanho da fila atual.
- **Detecção automática de desistência na fila:** hoje só existe expiração de no-show para *reserva* (`ExpirarReservasCommand`); a fila não tem equivalente. Adicionar: quando o cliente é chamado e não confirma em X minutos, marcar `status_saida = 'desistiu'` automaticamente (mesmo mecanismo de job agendado, aplicado à fila). Sem isso a "taxa de abandono" do Analytics fica sub-registrada (só captura quem cancelou manualmente).
- Frontend: dashboard do restaurante com os indicadores; tela do cliente mostrando "~X min de espera estimados" ao entrar na fila.

---

## Sprint 3 (semanas 7-9) — Alocação inteligente de mesa + tempo real

- Hoje `promoverProximoParaMesa` é greedy (primeira mesa liberada vai pro primeiro da fila que couber, sem otimizar). Trocar por uma passada que olha todas as mesas livres e todas as entradas de fila abertas, minimizando desperdício de capacidade. Diferencial mais defensável tecnicamente — dá pra apresentar com números ("antes: X% de capacidade desperdiçada, depois: Y%").
- **Priorização inteligente da fila:** hoje é FCFS puro. Adicionar reordenação por critério simples (ex.: grupo que cabe exatamente numa mesa prestes a vagar sobe na prioridade) — mesma "IA de otimização" do doc original, aplicada à ordem da fila e não só à alocação de mesa.
- **QR Code de entrada na fila:** gerar um QR por restaurante que leva direto à tela de entrar na fila — reduz atrito de entrada, cabe junto do resto do módulo de fila deste sprint.
- **Estados intermediários da mesa** (`aguardando_limpeza`, `em_limpeza`, além dos já existentes `livre/reservada/ocupada/bloqueada`): marcação manual pelo restaurante (não depende de RBAC nem de visão computacional — a própria conta do restaurante marca). Alimenta a métrica de "tempo médio de limpeza" no Analytics do Sprint 2/4.
- Laravel Reverb para broadcast de eventos (`fila.atualizada`, `mesa.status_mudou`), eliminando polling manual.
- **Notificações push** ("você é o próximo", "sua mesa está pronta") — fecha o loop do tempo real para quando o cliente não está com o app aberto. Não existe infra de push hoje (só e-mail transacional).
- Frontend: mapa de mesas ao vivo (admin) e posição na fila ao vivo (cliente), sem F5.

---

## Sprint 4 (semanas 10-12) — Assistente conversacional (OpenRouter) + fechamento

- Endpoint de chat no dashboard do restaurante: gerente pergunta em linguagem natural, o modelo usa **tool calling** contra funções reais do `AnalyticsService`.
- Modelo econômico via OpenRouter por padrão, com limite de tokens/rate limit por restaurante.
- Polimento geral, correção de bugs, testes end-to-end, roteiro de demo para o professor.

---

## Riscos identificados

- **Custo de API do OpenRouter** — definir orçamento/limite antes do Sprint 4, não na véspera.
- **Dado sintético vs real** — ser transparente na entrega sobre a origem dos dados usados nos gráficos/demo.
- **Reverb como serviço a mais no Docker Compose** — baixo risco, já orquestram tudo via Compose, mas é um container a mais para configurar.

---

## Backlog futuro — fora do escopo do PI4

Itens do documento de visão original ("RestaurantOS AI") que **fazem sentido como feature do Deep Dish especificamente** (continuam a linha de fila/mesa/reserva/atendimento), mas pressupõem escala/investimento que um projeto de semestre não tem. Registrados aqui para retomar quando (e se) o projeto virar algo maior que o PI4.

Deliberadamente **não** incluído aqui: escolhas de tecnologia genéricas do rascunho original sem relação específica com o produto (GraphQL, Kubernetes, troca de auth para Sanctum) e decisões de modelo de negócio (planos SaaS, billing, marketplace). Essas não são "features do Deep Dish que ficaram de fora" — são detalhe de infraestrutura ou de comercialização que se decide na hora, se e quando fizer sentido, não algo para catalogar como roadmap de produto.

### Visão Computacional (câmeras, YOLO/RT-DETR/Segment Anything)

Detectar ocupação, contagem de pessoas, limpeza e saída de clientes via câmera.
**Por que não agora:** exige hardware físico instalado em restaurante(s) parceiro(s), pipeline de vídeo em tempo real e dataset de treino. Não é código que se escreve num sprint — depende de uma parceria comercial que o projeto não tem. Processar o vídeo em tempo real também é o único cenário em que valeria introduzir um worker separado (ex.: Node + BullMQ/Redis) — sem visão computacional, as Laravel Queues já bastam, então essa infraestrutura nem entra em jogo antes disso.
**Pré-requisito antes de retomar:** ter pelo menos um restaurante piloto disposto a instalar câmeras e ceder imagens para treino.

### RBAC completo de equipe + automação de tarefas

Login para garçom/recepcionista/limpeza, com permissões por papel, fluxo automático tipo "mesa esvaziou → tarefa de limpeza criada → funcionário confirma → mesa liberada → próximo da fila chamado", e o **app React Native para a equipe** (recepcionista/garçom/gestor) que o documento original propõe — só faz sentido depois que existir login de funcionário para autenticar nele.
**Por que não agora:** decisão já tomada no Sprint 1 — competiria por tempo de equipe com o diferencial de IA, que é o que muda a percepção do projeto perante o professor.
**Pré-requisito antes de retomar:** nenhum técnico — é só questão de escopo/tempo. Pode entrar como primeiro item de um "PI5" ou pós-formatura.

### União de mesas (mesas compostas para grupos grandes)

Combinar duas ou mais mesas fisicamente adjacentes para atender um grupo maior que a capacidade de uma mesa isolada.
**Por que não agora:** exige modelagem nova (relação de mesas combináveis/adjacência, capacidade composta, o que quebra a suposição atual de que uma reserva ocupa exatamente uma `Mesa`). O Sprint 3 já entrega a otimização de alocação para mesas individuais, que é o ganho de maior retorno por esforço.
**Pré-requisito antes de retomar:** nenhum técnico bloqueante — é uma extensão de modelagem de dados que pode entrar em qualquer momento futuro, mas não compete pelo tempo dos 4 sprints atuais.

### Receita estimada (métrica de Analytics)

O documento original lista "receita estimada" como indicador do dashboard.
**Por que não cabe:** diferente dos outros itens deste backlog, este não é "fora de escopo por tempo/investimento" — é **estruturalmente impossível hoje**, porque o Deep Dish não tem cardápio, pedido nem preço no modelo de dados. Não existe dado de receita a estimar.
**Pré-requisito antes de retomar:** um módulo de cardápio/pedidos precisaria existir primeiro — isso é um produto praticamente novo, fora do escopo de "diferencial de IA para o app de fila/reserva atual".

### IA conversacional avançada + modelos locais (Ollama/Llama/Qwen self-hosted)

Versão evoluída do assistente do Sprint 4, rodando modelo próprio em vez de API paga, com recomendações estratégicas proativas (não só respondendo pergunta).
**Por que não agora:** o Sprint 4 já entrega a versão viável via OpenRouter; rodar modelo local só compensa financeiramente com volume de uso alto o suficiente para pesar mais que custo de GPU dedicada.
**Pré-requisito antes de retomar:** volume de chamadas ao assistente que torne o custo por token de API mais caro que manter infraestrutura própria.

### Digital Twin completo (estado detalhado por mesa: pedidos em aberto, garçom responsável, previsão de saída individual)

**Por que não agora:** depende de dois itens deste backlog ainda não resolvidos — RBAC (pra saber qual garçom está na mesa) e integração com PDV (pra saber os pedidos em aberto). O Sprint 3 já entrega uma versão simplificada (status da mesa em tempo real via Reverb), que é o que dá pra sustentar sem essas dependências.
**Pré-requisito antes de retomar:** RBAC de equipe + integração com PDV implementados.

### Integração com PDVs de terceiros

Cada restaurante usa um PDV diferente; exigiria conectores desacoplados por integração.
**Por que não agora:** esforço de desenvolvimento varia por PDV e depende de parceria/API de cada fornecedor — não é algo que se resolve de forma genérica em um sprint.
**Pré-requisito antes de retomar:** base de restaurantes reais pedindo uma integração específica (prioriza-se pela demanda, não de forma especulativa).

### Notificações via WhatsApp/SMS

**Por que não agora:** depende de contrato com provedor externo (Twilio, WhatsApp Business API) — custo recorrente e burocracia de aprovação, não só código.
**Pré-requisito antes de retomar:** decisão de negócio de arcar com esse custo recorrente.

### Previsão de espera com Machine Learning treinado (além da heurística estatística do Sprint 2)

**Por que não agora:** o Sprint 1 só começa a coletar histórico este semestre; não há volume de dados suficiente para treinar um modelo que supere a média histórica condicionada.
**Pré-requisito antes de retomar:** meses de dados reais de produção coletados a partir do Sprint 1 (a heurística do Sprint 2 já deixa a base pronta para essa evolução).

### Migração para React Native (alternativa ao Capacitor)

Trocar o app Capacitor por um app React Native de verdade, com componentes nativos em vez de WebView.

**Por que não agora:** o custo está concentrado na UI. `services/`, `contexts/`, `types/` e os schemas Zod (~1.000 linhas) migrariam trocando `localStorage` por `AsyncStorage`, mas as ~12 telas do cliente precisariam ser reescritas — `pages/app/` (1.740 linhas), as telas de auth, e os 53 componentes shadcn de `components/ui/`. É um sprint inteiro no semestre cujo diferencial prometido é a IA, e passaria a existir um segundo frontend para manter ao lado do painel web. Capacitor entrega APK real com push e câmera sem reescrever nada.

**Importante:** as duas opções não se anulam. A camada que sobreviveria a uma migração para RN é exatamente a que o Capacitor não toca — testar Capacitor primeiro não desperdiça trabalho caso a decisão mude.

**Gatilhos para reabrir a decisão** (avaliados ao fim da issue #22, com o APK rodando em aparelho físico — não antes, e não por especulação): lentidão perceptível em rolagem de lista ou transição de tela; recurso nativo necessário sem plugin Capacitor maduro; push ou câmera instáveis pela WebView; exigência de publicação em loja com padrão de UX nativo que a WebView não alcance.

**Pré-requisito antes de retomar:** nenhum técnico — o caminho seria Expo + NativeWind + React Navigation, mantendo o painel do restaurante na web. É questão de escopo/tempo e do veredito da #22.

### Diretório "shadow" + claim, e confirmação por WhatsApp com IA (modelo de duas camadas)

Resposta ao problema de aquisição ("preciso de N contratos com restaurantes"). **Camada 0:** restaurantes listados a partir de dados públicos; o cliente pede reserva, o sistema manda WhatsApp ("Mesa para 4 às 20h? SIM/NÃO"), uma IA interpreta a resposta em texto livre e o cliente é notificado — sem conta, painel ou contrato. Popula o app no dia 1 e gera demanda. **Camada 1:** ao ver a demanda chegando, o restaurante reivindica a listagem (claim) e ganha fila virtual, QR e dashboard. A gestão em tempo real só é exigida de quem optou por ela.

**Por que não agora:** o PI4 constrói a melhor Camada 1 possível — sem ela, não há o que reivindicar. Além disso, a Camada 0 depende de contrato com provedor de WhatsApp Business (custo recorrente e aprovação), já listado acima.

**Pré-requisito antes de retomar:** separar a identidade do estabelecimento das credenciais de acesso. Hoje `Restaurante` **é** a tabela de autenticação (`extends Authenticatable implements JWTSubject, MustVerifyEmail`), com `email`, `cnpj` e `password` obrigatórios — não existe restaurante "reivindicável". Esse é o bloqueio técnico real, e é estrutural.
