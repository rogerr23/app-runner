# Implantação

Este documento descreve o processo do protótipo. A versão atual está em
`https://app-runner.vercel.app`. Como a integração com o GitHub ainda não está
ativa, os deployments são iniciados manualmente pelo Vercel CLI.

## 1. Criar o projeto Supabase

Crie um projeto no painel do Supabase e guarde a senha do banco em um gerenciador
de senhas. Escolha uma região próxima dos usuários.

Associe o CLI e envie as migrations:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

Antes do push, confirme que o projeto selecionado é o ambiente correto. Não use
`db reset` em um projeto remoto.

Use somente chaves no formato `sb_publishable_...` na aplicação. Depois de
confirmar que nenhum componente utiliza chaves JWT antigas, desative `anon` e
`service_role` legadas em **Settings → API Keys**. O projeto não utiliza secret
key nas rotas atuais.

## 2. Configurar autenticação

Defina a URL pública do site e os redirects permitidos. No teste privado atual,
a confirmação de e-mail está desligada. Para uso público, configure SMTP,
habilite a confirmação e teste também a recuperação de senha.

## 3. Configurar a aplicação

Na plataforma de hospedagem, cadastre:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

A secret key não é necessária nos endpoints atuais. Só a adicione no futuro se
existir uma operação administrativa concreta e exclusivamente server-side.

## 4. Publicar

No fluxo atual, as mudanças são desenvolvidas e verificadas na `develop`,
enviadas ao GitHub e publicadas manualmente pelo Vercel CLI. A `main` permanece
sem alterações diretas.

O fluxo desejado para a próxima etapa é conectar o repositório à Vercel, usar a
`main` como branch de produção e gerar previews para a `develop` e Pull Requests.
Depois disso, a promoção para produção deverá acontecer por Pull Request após os
checks.

O plano Hobby da Vercel é destinado a uso pessoal e não comercial. Reavalie o
plano ou o provedor antes de exploração comercial. A referência atual é a
[documentação oficial do plano Hobby](https://vercel.com/docs/plans/hobby).

## 5. Verificar

- abrir `/api/health`;
- cadastrar uma conta de teste;
- confirmar criação automática do perfil;
- criar um planejamento, uma corrida e uma meta;
- testar com uma segunda conta e confirmar o isolamento;
- verificar logs sem expor dados sensíveis.

## Rollback

Alterações de aplicação podem ser revertidas para um deployment anterior. Para
banco, prefira migrations corretivas e testadas. Não edite migrations que já
foram aplicadas remotamente.
