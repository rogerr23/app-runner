# App Runner

Aplicação web mobile-first para quem corre ou quer começar a correr. O produto
oferece um caminho simples para planejar treinos, registrar atividades e
acompanhar metas sem exigir relógio esportivo ou rastreamento por GPS.

O projeto está na fase de MVP privado, inicialmente pensado para três pessoas.

## O que já existe

- cadastro, login e logout com sessão em cookie;
- perfil automático para cada novo usuário;
- planejamento de corridas;
- registro e histórico de corridas;
- cálculo automático do ritmo médio pelo banco;
- criação e acompanhamento de metas;
- isolamento de dados por usuário com Row Level Security;
- ambiente Supabase local reproduzível com Docker;
- validação de entrada, testes unitários e testes de segurança do banco;
- API HTTP pronta para receber a interface mobile-first.

GPS em tempo real, integrações com relógios, feed social e pagamentos estão fora
do primeiro MVP.

## Tecnologias

- **Next.js 16, React 19 e TypeScript:** aplicação e API;
- **Supabase:** PostgreSQL 17, autenticação e Data API;
- **Zod:** validação dos contratos HTTP;
- **Vitest e pgTAP:** testes de aplicação e banco;
- **Vercel:** hospedagem planejada para o protótipo.

As versões são fixadas no `package-lock.json` para que instalações sejam
reproduzíveis.

## Início rápido

Pré-requisitos: Node.js 22 ou superior e Docker Desktop em execução.

```bash
npm install
npm run db:start
npm run db:status
cp .env.example .env.local
```

Copie `API_URL` para `NEXT_PUBLIC_SUPABASE_URL` e `PUBLISHABLE_KEY` para
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no `.env.local`. Depois execute:

```bash
npm run dev
```

A aplicação estará em `http://localhost:3000`, a API em `/api` e o Supabase
Studio em `http://localhost:54323`. Consulte o passo a passo completo em
[`docs/local-development.md`](./docs/local-development.md).

## Comandos principais

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o Next.js em desenvolvimento |
| `npm run check` | Executa lint, tipos e testes unitários |
| `npm run build` | Gera o build de produção |
| `npm run db:start` | Inicia o Supabase local |
| `npm run db:reset` | Recria o banco aplicando migrations e seed |
| `npm run db:lint` | Analisa o schema PostgreSQL |
| `npm run db:test` | Testa constraints e políticas RLS |
| `npm run db:types` | Regera tipos TypeScript a partir do banco |

## Documentação

- [Arquitetura](./docs/architecture.md)
- [Banco de dados](./docs/database.md)
- [Autenticação e segurança](./docs/authentication.md)
- [Contrato da API](./docs/api.md)
- [Desenvolvimento local](./docs/local-development.md)
- [Primeiros passos no Supabase](./docs/supabase-first-setup.md)
- [Implantação](./docs/deployment.md)
- [Decisão da stack](./docs/decisions/001-technology-stack.md)

## Fluxo Git

O trabalho acontece na branch `develop`. A `main` representa a versão estável e
deve receber mudanças por Pull Request. Commits seguem, sempre que possível, o
padrão Conventional Commits (`feat:`, `fix:`, `docs:`, `test:` e `chore:`).

## Custos do protótipo

O uso privado por três pessoas cabe nos planos gratuitos do Supabase e, quando
for pessoal e não comercial, da Vercel. Um domínio próprio é opcional. Projetos
Supabase gratuitos podem ser pausados após baixa atividade; os limites e termos
dos provedores devem ser revistos antes de uso público ou comercial.

## Segurança

Nunca adicione `.env.local`, secret keys ou senhas ao Git. A publishable key do
Supabase pode chegar ao navegador porque as tabelas públicas são protegidas por
RLS. A secret key ignora essas políticas e deve permanecer exclusivamente no
servidor.

## Licença

Ainda não definida. Até que uma licença seja adicionada, o código não deve ser
considerado liberado para redistribuição.
