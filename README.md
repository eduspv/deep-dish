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
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

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

Arquitetura
└── React SPA → Laravel API REST → PostgreSQL
```

---

## 🗂️ Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── layouts/          # Layouts: público, cliente e admin
├── pages/            # Páginas da aplicação
├── routes/           # Configuração de rotas e guards
├── services/         # Camada de serviços (modelo de integração)
├── mocks/            # Dados mockados para o MVP
├── types/            # Tipagens TypeScript globais
└── utils/            # Funções auxiliares
```

---

## 🚀 Rodando Localmente

### Pré-requisitos

- Node.js `>= 18`
- npm `>= 9`

### Instalação

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🔐 Controle de Acesso

O sistema possui proteção de rotas por perfil de usuário:

| Perfil | Acesso |
|---|---|
| `USER` | Área do cliente — fila e reservas |
| `RESTAURANT` | Painel admin do restaurante |
| `ADMIN` | Gestão geral da plataforma |

> No MVP, a autenticação é simulada via mock. Em produção será controlada por **JWT / Laravel Sanctum**.

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

- [x] MVP com dados mockados
- [x] Fluxo completo cliente e restaurante
- [ ] Integração com API Laravel
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
| João Pedro Vieira de Oliveira | Desenvolvedor Full Stack | !!!!!!!!!
| Arthur Cavalcante Neves | Desenvolvedor Full Stack | UI-UX |

---

<div align="center">

**Deep Dish** — Feito com ☕ e muito cuidado pelos integrantes do time.

</div>
