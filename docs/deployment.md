# Implantação

Este documento descreve o caminho planejado para o protótipo. A implantação não
é automática nesta fase para evitar alterações remotas acidentais.

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

## 2. Configurar autenticação

Defina a URL pública do site e os redirects permitidos. Para o teste controlado,
decida conscientemente se a confirmação de e-mail ficará desligada. Para uso
público, configure SMTP e habilite a confirmação.

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

Conecte o repositório à Vercel e use a `main` como branch de produção. A branch
`develop` pode gerar previews. A promoção para produção deve acontecer por Pull
Request após os checks.

O plano Hobby da Vercel é destinado a uso pessoal e não comercial. Reavalie o
plano ou o provedor antes de exploração comercial.

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
