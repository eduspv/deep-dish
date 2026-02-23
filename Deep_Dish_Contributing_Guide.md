# Deep Dish -- Contributing Guide

Este documento define as regras oficiais de contribuição do projeto
**Deep Dish**.\
Todo membro da equipe deve seguir estas diretrizes para garantir
organização, qualidade de código e fluidez no desenvolvimento.

------------------------------------------------------------------------

## 1. Estrutura de Branches

-   **main**: contém apenas código em produção.
-   **develop**: contém código estável e integrado.

------------------------------------------------------------------------

## 2. Criação de Branches

Toda nova branch deve ser criada a partir da `develop` e seguir o
padrão:

    Tipo/NomeDaBranch

### Tipos permitidos:

-   Feature\
-   Fix\
-   Chore\
-   Hotfix

### Exemplos:

    Feature/AuthLogin
    Fix/ReservaDuplicada
    Chore/ConfigJWT

------------------------------------------------------------------------

## 3. Padrão de Commits

Formato obrigatório:

    tipo: descrição clara do que foi feito

### Tipos permitidos:

-   feature
-   fix
-   chore
-   refactor
-   docs

### Exemplo:

    feature: adicionado autenticação de login ao usuário

------------------------------------------------------------------------

## 4. Pull Requests

-   Todo código deve passar por **Pull Request**.
-   PRs devem ser abertos sempre para a branch `develop`.
-   Somente o **Tech Lead** pode aprovar PRs e realizar merges para
    `develop` e `main`.

------------------------------------------------------------------------

## 5. Code Review Padronizado

Toda revisão realizada pelo Tech Lead seguirá o seguinte modelo
estruturado:

### Status Geral:

-   Aprovado
-   Aprovado com ajustes menores
-   Necessita correções obrigatórias

### Categorias de Avaliação:

-   Arquitetura
-   Banco de Dados
-   Frontend
-   Segurança

### Ajustes Obrigatórios:

Itens marcados como obrigatórios devem ser corrigidos antes do merge.

------------------------------------------------------------------------

## Exemplo de Code Review

**Status:** Necessita correções obrigatórias

### Arquitetura:

-   Controller contém regra de negócio. Mover para service.

### Banco de Dados:

-   Adicionar constraint para evitar duplicidade de reserva.

### Frontend:

-   Implementar tratamento de estado de loading.

### Ajustes obrigatórios:

-   Criar service para validação de reserva
-   Adicionar unique constraint
-   Implementar tratamento de erro

------------------------------------------------------------------------

## Regras Finais

-   Commits diretos em `main` ou `develop` não são permitidos.
-   Branch fora do padrão será recusada.
-   Merge sem aprovação do Tech Lead é proibido.
-   Notes do Tech Lead devem ser tratadas como obrigatórias.

------------------------------------------------------------------------

Estas regras existem para garantir qualidade, clareza e evolução
sustentável do projeto **Deep Dish**.
