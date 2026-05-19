# Deep Dish — Backend

API REST construída com **Laravel**, responsável por autenticação, reservas, fila de espera, mesas e funcionários.

---

## Estrutura principal

```
app/
 ├── Http/
 │    ├── Controllers/     # Controllers por domínio (Auth, Reservas, Mesa, Fila...)
 │    └── Middleware/      # JWT, verificação de e-mail, throttle
 ├── Models/               # Eloquent models (Cliente, Restaurante, Mesa, Reserva...)
 ├── Notifications/        # E-mails transacionais (verificação, redefinição de senha)
 └── Jobs/                 # Jobs assíncronos processados pelo worker
database/
 ├── migrations/           # Migrations do banco PostgreSQL
 └── seeders/
routes/
 └── api.php               # Todas as rotas da API
```

## Tecnologias

- Laravel + PHP 8.2
- PostgreSQL (Supabase — session pooling, porta 5432)
- JWT Auth (`php-open-source-saver/jwt-auth`)
- Laravel Queue (driver `database`) + Queue Worker para e-mails assíncronos

## Worker de Filas

O worker processa e-mails de verificação de conta em background. É obrigatório para o fluxo de autenticação funcionar.

```bash
php artisan queue:work --tries=3 --sleep=3
```

Com Docker, ele sobe automaticamente — não é necessário rodar manualmente.

## Como rodar

Veja as instruções completas (com e sem Docker) no [README da raiz do projeto](../README.md).