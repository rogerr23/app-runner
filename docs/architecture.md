# Arquitetura

## Visão geral

O Pista usa uma arquitetura web full-stack. O Next.js entrega a interface e
expõe Route Handlers em `/api`. Esses handlers validam a entrada e acessam o
Supabase em nome do usuário autenticado. O PostgreSQL mantém os dados e aplica a
autorização final com Row Level Security (RLS).

```text
Navegador móvel
      |
      | HTTPS + cookie de sessão
      v
Next.js Route Handlers
      |
      | JWT do usuário
      v
Supabase Data API + Auth
      |
      | grants + RLS + constraints
      v
PostgreSQL
```

## Responsabilidades

### Next.js

- expor contratos HTTP estáveis para a interface;
- converter JSON externo para o formato do banco;
- validar payloads com Zod;
- gerenciar cookies de sessão;
- normalizar respostas e erros.

### Supabase Auth

- cadastrar e autenticar usuários;
- emitir e atualizar tokens de sessão;
- disponibilizar a identidade para as políticas do banco.

### PostgreSQL

- armazenar perfis, planejamentos, corridas e metas;
- validar limites e relacionamentos com constraints;
- calcular o ritmo médio;
- impedir acesso cruzado com RLS;
- criar o perfil automaticamente após o cadastro.

## Decisões de segurança

A API usa a publishable key e o token do usuário, nunca a secret key, nas
operações comuns. Isso mantém as políticas RLS ativas mesmo se houver um erro de
autorização na camada HTTP.

Não existe acesso anônimo às tabelas do domínio. Grants são declarados
explicitamente na migration, e cada tabela pública tem RLS habilitada.

## Organização do código

```text
src/app/page.tsx         interface mobile-first e estado do cliente
src/app/globals.css      sistema visual e layouts responsivos
src/app/api/             endpoints HTTP
public/                  ativos públicos e imagem de compartilhamento
src/lib/api/             autenticação e tratamento de erros
src/lib/supabase/        cliente SSR e tipos gerados
src/lib/validation/      schemas de entrada e testes
supabase/migrations/     histórico versionado do banco
supabase/tests/          testes pgTAP de segurança
docs/                    documentação por assunto
```

## Evolução prevista

A interface consome apenas os Route Handlers, mantendo o Supabase fora dos
componentes de tela. Funcionalidades que exijam operações atômicas mais
complexas podem ser implementadas como funções SQL e chamadas via RPC.
Integrações externas devem ficar no servidor e usar variáveis de ambiente
próprias.
