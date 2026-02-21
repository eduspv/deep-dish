<<<<<<< HEAD
# 🍽️ Deep Dish -- Frontend

O **Deep Dish** é uma plataforma digital de **fila inteligente e reserva
de mesas para restaurantes**, desenvolvida para organizar o fluxo de
atendimento em tempo real e melhorar a experiência tanto do cliente
quanto do restaurante.

Este repositório contém o **frontend da aplicação**, construído como SPA
moderna, responsiva e orientada a performance.

------------------------------------------------------------------------

## 🚀 Visão Geral

O sistema é dividido em dois grandes contextos:

### 👤 Cliente

-   Busca restaurantes
-   Entra na fila remotamente
-   Faz reservas antecipadas
-   Acompanha posição na fila
-   Cancela reservas ou fila
-   Recebe notificações in-app

### 🍽️ Restaurante (Admin)

-   Configura restaurante
-   Gerencia mesas
-   Controla fila em tempo real
-   Visualiza reservas do dia
-   Atualiza status manualmente
-   Gerencia funcionários

------------------------------------------------------------------------

## 🎯 Objetivo do MVP

-   Eliminar filas físicas desorganizadas
-   Centralizar reservas e fila em um único sistema
-   Dar controle total ao restaurante
-   Oferecer transparência ao cliente
-   Interface moderna, rápida e intuitiva

------------------------------------------------------------------------

## 🎨 Identidade Visual

O design do Deep Dish foi pensado estrategicamente com base na
psicologia das cores:

-   🔴 **Vermelho** → Energia, fome, urgência (botões principais e ações
    importantes)
-   ⚫ **Preto** → Sofisticação e luxo (detalhes, headers, contraste
    premium)
-   🟤 **Marrom & Bege** → Conforto, rústico sofisticado (backgrounds e
    áreas de conteúdo)
-   ❌ Roxo é evitado (associação negativa no contexto alimentar)

A interface utiliza: - Layout moderno - Cards com bordas suaves -
Microanimações sutis - Design mobile-first - Componentização escalável

------------------------------------------------------------------------

## 🧱 Arquitetura do Projeto

Este projeto é uma **Single Page Application (SPA)**.

### Estrutura principal:

    src/
     ├── components/      # Componentes reutilizáveis
     ├── layouts/         # Layout público, cliente e admin
     ├── pages/           # Páginas do sistema
     ├── routes/          # Configuração das rotas
     ├── services/        # Serviços (modelo de integração API)
     ├── mocks/           # Dados mockados (MVP sem backend)
     ├── types/           # Tipagens TypeScript
     └── utils/           # Helpers

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

-   ⚡ Vite
-   ⚛️ React
-   🟦 TypeScript
-   🎨 Tailwind CSS
-   🧩 shadcn-ui
-   🔀 React Router

------------------------------------------------------------------------

## 🔌 Integração com Backend

O frontend foi estruturado para integrar com uma API Laravel.

Atualmente: - Serviços estão modelados - Endpoints estão documentados
nos arquivos - Dados mockados simulam respostas reais

Quando o backend estiver pronto, basta substituir os mocks pelas
chamadas HTTP reais.

------------------------------------------------------------------------

## 🧪 Rodando o projeto localmente

### 1️⃣ Clone o repositório

``` bash
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>
```

### 2️⃣ Instale as dependências

``` bash
npm install
```

### 3️⃣ Rode o servidor

``` bash
npm run dev
```

O projeto estará disponível em:

http://localhost:5173

------------------------------------------------------------------------

## 📦 Variáveis de Ambiente (quando integrar com API)

Crie um arquivo `.env`:

    VITE_API_URL=http://127.0.0.1:8000

------------------------------------------------------------------------

## 🔐 Controle de Rotas

O sistema possui proteção de rotas por perfil:

-   USER
-   RESTAURANT
-   ADMIN

No MVP, isso é simulado via mock. No futuro será controlado por token
JWT / Sanctum.

------------------------------------------------------------------------

## 📈 Roadmap Futuro

-   Integração completa com API Laravel
-   Atualização em tempo real (WebSockets)
-   Notificações push
-   Analytics para restaurantes
-   Sistema de pagamento
-   Controle avançado de capacidade

------------------------------------------------------------------------

## 🏗️ Arquitetura Geral do Sistema

    React (Frontend)
            ↓
    Laravel API (Backend)
            ↓
    PostgreSQL

------------------------------------------------------------------------

## ✨ Deep Dish

Uma experiência moderna para restaurantes que querem organização,
velocidade e sofisticação.
=======
# 🍽️ Deep Dish

**Deep Dish** é uma plataforma digital de **fila e reserva de mesas para restaurantes**, desenvolvida para organizar o fluxo de atendimento em tempo real, reduzir filas presenciais e melhorar a experiência tanto do cliente quanto do restaurante.

O sistema une **fila digital centralizada** e **reservas antecipadas**, oferecendo controle operacional simples, claro e eficiente.

---

## 🚀 Visão Geral do Produto

### 👤 Cliente
- Visualizar restaurantes disponíveis
- Entrar na fila remotamente
- Realizar reservas antecipadas
- Acompanhar posição na fila
- Receber notificações in-app
- Cancelar fila ou reserva

### 🍽️ Restaurante
- Configurar horários, capacidade e mesas
- Controlar a fila em tempo real
- Gerenciar reservas do dia
- Atualizar status manualmente
- Centralizar toda a operação em um painel único

---

## 🎯 Objetivo do MVP

- Eliminar a confusão de filas presenciais
- Centralizar reservas e fila em um único sistema
- Garantir controle total ao restaurante
- Oferecer transparência ao cliente
- Manter a solução simples, rápida e confiável

---

## 🧱 Arquitetura do Projeto

### 📦 Principais Entidades
- users  
- restaurants  
- restaurant_tables  
- reservations  
- queue_entries  
- time_slots  
- notifications  
- restaurant_settings  

### 🛠️ Ferramentas Utilizadas
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Laravel  
- **Banco de Dados:** PostgreSQL  

---

## 🧩 Organização do Projeto

O projeto é organizado utilizando **GitHub Projects**, com a seguinte estrutura:

- **Épicos** → visão macro do produto  
- **Tasks (Issues)** → trabalho executável  
- **Sprints** → organização por ciclos de entrega  
- **Board** → acompanhamento da execução  

### 📌 Regra Importante
- **Épicos não entram em sprints**
- **Apenas tasks entram nas sprints**

---
>>>>>>> 441e864c2b9195490221e5f73133da27aa537a26
