# Deep Dish — Frontend

SPA construída com **React + TypeScript + Vite**, responsável pela interface do cliente e do painel do restaurante.

---

## Estrutura principal

```
src/
 ├── components/      # Componentes reutilizáveis (UI, dialogs, tabelas)
 ├── contexts/        # Contextos globais (AuthContext)
 ├── layouts/         # Layouts por perfil (público, cliente, restaurante)
 ├── pages/           # Páginas do sistema (Login, Dashboard, Reservas, etc.)
 ├── routes/          # Configuração de rotas protegidas por perfil
 ├── services/        # Integração com a API (httpClient, endpoints)
 ├── types/           # Tipagens TypeScript
 └── utils/           # Helpers
```

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- JWT (armazenado em localStorage)

## Como rodar

Veja as instruções completas (com e sem Docker) no [README da raiz do projeto](../README.md).
