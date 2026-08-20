# Primeiros passos no Supabase

Este guia resume as áreas do painel necessárias para manter o protótipo. A maior
parte do banco continua sendo gerenciada por código e migrations.

## Project Overview

Mostra o estado do projeto e atalhos de conexão. No plano gratuito, um projeto
com pouca atividade pode ser pausado após uma semana. Ele pode ser reativado
pelo próprio painel. Consulte a
[documentação oficial de pausa](https://supabase.com/docs/guides/platform/free-project-pausing)
antes de depender do ambiente para uma demonstração importante.

## Table Editor

Permite visualizar registros, mas não deve ser usado para mudar a estrutura das
tabelas. Mudanças de schema devem nascer em `supabase/migrations` e ser aplicadas
com `npx supabase db push`.

Editar dados manualmente pode ser útil durante testes, mas pula as validações da
API. Prefira os fluxos do aplicativo sempre que possível.

## Authentication

Em **Authentication → Users** é possível consultar e remover contas de teste.
Em **URL Configuration** ficam a URL pública do site e os redirects autorizados.
Esses valores devem ser atualizados depois que a aplicação receber sua URL de
preview ou produção.

No ambiente público, a confirmação de e-mail deve ser uma decisão consciente. O
SMTP padrão tem limites baixos; configure um provedor próprio antes de abrir o
cadastro para muitas pessoas.

## API Keys

Use a chave `sb_publishable_...` na variável
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Ela foi desenhada para uso público e
continua limitada por RLS.

Não use ou copie:

- `sb_secret_...`;
- `service_role` legada;
- senha do banco;
- access token pessoal do CLI.

Essas credenciais dão acesso administrativo. O backend atual não precisa delas.
Chaves legadas `anon` e `service_role` devem permanecer desativadas quando todos
os clientes usam as chaves novas.

## Database e migrations

Para comparar o projeto local e remoto sem alterar dados:

```bash
npx supabase migration list --linked
npx supabase db push --linked --dry-run
```

Para aplicar uma migration já revisada:

```bash
npx supabase db push --linked
```

Nunca execute `db reset` no projeto remoto. Não edite uma migration que já foi
aplicada; crie uma migration corretiva.

## Atividades que exigem o painel

- reativar um projeto pausado;
- gerenciar membros da organização;
- configurar SMTP e URLs de autenticação;
- desativar ou criar API keys;
- consultar uso e limites do plano;
- restaurar backups quando disponíveis.

Schema, políticas RLS, triggers e índices devem continuar no repositório.
