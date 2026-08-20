# Ambientes

## Local

- aplicação: `http://localhost:3000`;
- Supabase API: `http://127.0.0.1:54321`;
- Supabase Studio: `http://127.0.0.1:54323`;
- confirmação de e-mail: desabilitada;
- banco: containers Docker gerenciados pelo Supabase CLI.

O ambiente local usa `supabase/config.toml` e pode ser recriado com
`npm run db:reset`.

## Produção do protótipo

- aplicação: `https://app-runner.vercel.app`;
- hospedagem: Vercel Hobby;
- banco e autenticação: Supabase Free;
- região atual do banco: West US (Oregon);
- confirmação de e-mail: desabilitada para o teste privado;
- cadastro: habilitado;
- acesso às tabelas: somente usuários autenticados e limitados por RLS.

A confirmação de e-mail deve ser habilitada junto com SMTP próprio antes de
abrir o cadastro ao público.

## Variáveis da Vercel

Os ambientes Development, Preview e Production possuem:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

Todas são públicas por definição. Nenhuma secret key ou chave `service_role` é
necessária. As chaves legadas do Supabase estão desativadas.

## Promoção e deploy

A aplicação é publicada pelo Vercel CLI a partir do conteúdo validado na
`develop`. Até a integração GitHub ser ativada na conta Vercel, novos deployments
precisam ser iniciados explicitamente. A branch `main` continua sendo a
referência estável e não recebe pushes diretos.

Ao habilitar a integração GitHub, configure `main` como branch de produção e use
deployments de Preview para `develop` e Pull Requests.
