<div align="center">

<br/>

```
██████╗ ███████╗███████╗██████╗     ██████╗ ██╗███████╗██╗  ██╗
██╔══██╗██╔════╝██╔════╝██╔══██╗    ██╔══██╗██║██╔════╝██║  ██║
██║  ██║█████╗  █████╗  ██████╔╝    ██║  ██║██║███████╗███████║
██║  ██║██╔══╝  ██╔══╝  ██╔═══╝     ██║  ██║██║╚════██║██╔══██║
██████╔╝███████╗███████╗██║         ██████╔╝██║███████║██║  ██║
╚═════╝ ╚══════╝╚══════╝╚═╝         ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝
```

**Fila inteligente. Reservas sem fricção. Restaurantes no controle.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📌 Sobre o Projeto

**Deep Dish** é uma plataforma digital de **fila inteligente e reserva de mesas** para restaurantes. O sistema organiza o fluxo de atendimento em tempo real, eliminando filas físicas desorganizadas e centralizando reservas em uma única interface — moderna, rápida e intuitiva.

> Uma experiência premium para restaurantes que valorizam organização, velocidade e sofisticação.

---

## ✨ Funcionalidades

### 👤 Área do Cliente
| Funcionalidade | Status |
|---|---|
| Busca de restaurantes | ✅ MVP |
| Entrada remota na fila | ✅ MVP |
| Reservas antecipadas | ✅ MVP |
| Acompanhamento da posição na fila | ✅ MVP |
| Cancelamento de fila / reserva | ✅ MVP |
| Notificações in-app | ✅ MVP |

### 🍽️ Área do Restaurante (Admin)
| Funcionalidade | Status |
|---|---|
| Configuração do restaurante | ✅ MVP |
| Gerenciamento de mesas | ✅ MVP |
| Controle de fila em tempo real | ✅ MVP |
| Visualização de reservas do dia | ✅ MVP |
| Atualização manual de status | ✅ MVP |
| Gestão de funcionários | ✅ MVP |

---

## 🛠️ Stack Tecnológica

```
Frontend
├── ⚡ Vite           — build ultrarrápido
├── ⚛️  React 18       — UI reativa e componentizada
├── 🟦 TypeScript     — tipagem estática e segurança
├── 🎨 Tailwind CSS   — estilização utilitária mobile-first
├── 🧩 shadcn/ui      — componentes acessíveis e customizáveis
└── 🔀 React Router   — navegação SPA com proteção de rotas

Backend
├── 🐘 Laravel 11     — API REST
├── 🔐 JWT Auth       — autenticação stateless
├── 🗃️  PostgreSQL     — banco de dados relacional (Supabase)
└── ⚙️  Queue Worker   — processamento assíncrono de e-mails

Infraestrutura
└── 🐳 Docker Compose — orquestração dos serviços (frontend + backend + worker)

Arquitetura
└── React SPA → Laravel API REST → PostgreSQL
```

---

## 🗂️ Estrutura do Projeto

```
deep-dish/
├── deep-dish-frontend/   # SPA React (interface do cliente e do restaurante)
├── deep-dish-backend/    # API Laravel (autenticação, reservas, fila, mesas)
└── docker-compose.yml    # Orquestração dos serviços

deep-dish-frontend/src/
├── components/       # Componentes reutilizáveis
├── layouts/          # Layouts: público, cliente e admin
├── pages/            # Páginas da aplicação
├── routes/           # Configuração de rotas e guards
├── services/         # Camada de integração com a API
├── types/            # Tipagens TypeScript globais
└── utils/            # Funções auxiliares
```

---

## 🚀 Rodando Localmente

### 🐳 Com Docker (recomendado)

O jeito mais fácil de subir o projeto inteiro. Sobe o **frontend**, o **backend** e o **worker de filas** automaticamente — sem precisar instalar PHP, Composer ou configurar ambiente manualmente.

**Pré-requisito:** ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado.

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd deep-dish

# 2. Configure as variáveis de ambiente do backend
cp deep-dish-backend/.env.example deep-dish-backend/.env
# edite o arquivo com suas credenciais (banco, JWT, SMTP)

# 3. Suba os containers
docker compose up --build
```

Ou em background (libera o terminal):

```bash
docker compose up --build -d
```

Após subir:
- **Frontend:** http://localhost:8080
- **Backend (API):** http://localhost:8000

> Na primeira execução o `composer install` e o `npm install` rodam automaticamente dentro dos containers. Pode levar alguns minutos.

**Comandos úteis:**

```bash
docker compose logs -f        # ver logs em tempo real
docker compose ps             # status dos containers
docker compose down           # parar tudo
docker compose restart backend  # reiniciar um serviço
```

---

### 🛠️ Sem Docker (manual)

**Pré-requisitos:** Node.js `>= 18`, PHP `>= 8.2`, Composer

**Frontend:**

```bash
cd deep-dish-frontend
npm install
npm run dev
```

Disponível em **http://localhost:8080**

**Backend:**

```bash
cd deep-dish-backend
composer install
cp .env.example .env
php artisan serve
```

Disponível em **http://localhost:8000**

**Worker de filas** (obrigatório para envio de e-mails de verificação):

```bash
# dentro de deep-dish-backend/
php artisan queue:work --tries=3 --sleep=3
```

> Sem o worker ativo, e-mails de verificação de conta **não serão entregues**.

---

### Variáveis de Ambiente

**Frontend** — crie `deep-dish-frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

**Backend** — copie `deep-dish-backend/.env.example` e preencha banco de dados, JWT e SMTP.

---

## ⚙️ Worker de Filas

O sistema utiliza um **worker de filas** para processar tarefas assíncronas em background — principalmente o **envio de e-mails de verificação de conta**.

Quando um usuário se cadastra ou faz login sem ter verificado o e-mail, o sistema enfileira o disparo do e-mail em vez de enviar na hora. O worker fica rodando em paralelo e processa essa fila continuamente.

- **Com Docker:** o worker sobe automaticamente como o serviço `queue` — nenhum comando extra necessário.
- **Sem Docker:** é preciso rodar `php artisan queue:work` manualmente.

---

## 🔐 Controle de Acesso

O sistema possui proteção de rotas por perfil de usuário via token **JWT**:

| Perfil | Acesso |
|---|---|
| `Cliente` | Área do cliente — fila e reservas |
| `Restaurante` | Painel admin do restaurante |

---

## 🎨 Identidade Visual

O design foi construído com base na **psicologia das cores** aplicada ao setor alimentar:

| Cor | Significado | Uso |
|---|---|---|
| 🔴 Vermelho | Energia, fome, urgência | Botões primários e CTAs |
| ⚫ Preto | Sofisticação, luxo | Headers, contrastes premium |
| 🟤 Marrom / Bege | Conforto, rústico sofisticado | Backgrounds e áreas de conteúdo |

> ⚠️ **Roxo é intencionalmente evitado** — pesquisas indicam associação negativa no contexto alimentar.

---

## 📈 Roadmap

- [x] MVP com fluxo completo cliente e restaurante
- [x] Integração com API Laravel (JWT, reservas, fila, mesas, funcionários)
- [x] Verificação de e-mail com worker de filas
- [x] Configuração Docker para onboarding simplificado
- [ ] Atualizações em tempo real via WebSockets
- [ ] Notificações push
- [ ] Analytics para restaurantes
- [ ] Sistema de pagamento integrado
- [ ] Controle avançado de capacidade por turno

---

## 📎 Links

- 🎨 [Pitch Deck no Canva](https://www.canva.com/design/DAHDZnOSuv4/Id21tAfjwMEOS-4B5mpf_w/edit)

---

## 👥 Time

| Nome | Papel |
|---|---|
| Brenda Regis Batista Bandeira | Analista de Requisitos / UX |
| Eduardo Gondim Marinho | Analista de Requisitos / UX |
| Eduardo Serra Pierre Vidal | Desenvolvedor Full Stack / Scrum Master |
| João Guilherme Costa Pereira | Desenvolvedor Full Stack |
| João Pedro Vieira de Oliveira | Desenvolvedor Full Stack |
| Arthur Cavalcante Neves | Desenvolvedor Full Stack / UI-UX |

---

<div align="center">

**Deep Dish** — Feito com ☕ e muito cuidado pelos integrantes do time.

</div>
