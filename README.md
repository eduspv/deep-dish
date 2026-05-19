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

O frontend integra com a API Laravel via HTTP (autenticação JWT, reservas, fila, mesas e funcionários).

------------------------------------------------------------------------

## 🧪 Rodando o projeto localmente

### 1️⃣ Clone o repositório

``` bash
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>
```

---

### 🐳 Com Docker (recomendado)

O jeito mais fácil de subir o projeto inteiro — sobe o **frontend**, o **backend** e o **worker de filas** automaticamente, sem precisar instalar PHP, Composer ou Node manualmente.

**Pré-requisito:** ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.

Configure as variáveis de ambiente do backend:

``` bash
cp deep-dish-backend/.env.example deep-dish-backend/.env
```

Suba os containers (na raiz do projeto):

``` bash
docker compose up --build
```

Ou em background (libera o terminal):

``` bash
docker compose up --build -d
```

Após subir:
- **Frontend:** http://localhost:8080
- **Backend (API):** http://localhost:8000

> Na primeira execução o `composer install` e o `npm install` rodam automaticamente. Pode levar alguns minutos.

Comandos úteis:

``` bash
docker compose logs -f        # ver logs em tempo real
docker compose ps             # status dos containers
docker compose down           # parar tudo
```

---

### 🛠️ Sem Docker (manual)

**Frontend:**

Instale as dependências e rode o servidor:

``` bash
npm install
npm run dev
```

O frontend estará disponível em http://localhost:8080

**Backend:**

``` bash
cd deep-dish-backend
composer install
php artisan serve
```

O backend estará disponível em http://localhost:8000

**Worker de filas** (necessário para envio de e-mails de verificação):

``` bash
php artisan queue:work --tries=3 --sleep=3
```

------------------------------------------------------------------------

## 📦 Variáveis de Ambiente

**Frontend** — crie `deep-dish-frontend/.env`:

    VITE_API_URL=http://127.0.0.1:8000/api

**Backend** — crie `deep-dish-backend/.env` a partir do `.env.example` e preencha banco de dados, JWT e SMTP.

------------------------------------------------------------------------

## 🔐 Controle de Rotas

O sistema possui proteção de rotas por perfil via token **JWT**:

-   Cliente
-   Restaurante

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
