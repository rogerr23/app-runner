# Desenvolvimento local

## Pré-requisitos

- Node.js 22 ou superior;
- npm;
- Docker Desktop ativo;
- Git.

## Instalação

```bash
git switch develop
npm install
npm run db:start
```

Na primeira execução, o Supabase baixa imagens Docker e pode demorar alguns
minutos. Consulte as URLs e chaves locais:

```bash
npm run db:status
```

Crie o arquivo local de ambiente:

```bash
cp .env.example .env.local
```

Preencha-o com `API_URL` e `PUBLISHABLE_KEY` exibidos pelo comando anterior. Não
use a secret key como publishable key e não adicione `.env.local` ao Git.

## Executar

```bash
npm run dev
```

- aplicação: `http://localhost:3000`;
- health check: `http://localhost:3000/api/health`;
- Supabase Studio: `http://localhost:54323`;
- e-mails locais: `http://localhost:54324`.

## Criar usuários de teste

Use `POST /api/auth/signup` ou a área Authentication do Supabase Studio. Como a
confirmação local está desligada, o usuário pode entrar imediatamente.

Não há senhas de demonstração versionadas no repositório.

## Validar mudanças

```bash
npm run check
npm run db:lint
npm run db:test
npm run build
```

Ao alterar o banco, execute também:

```bash
npm run db:reset
npm run db:types
```

Revise o arquivo de tipos gerado antes do commit.

## Parar o ambiente

```bash
npm run db:stop
```

O comando preserva os volumes locais. `npm run db:reset` recria o conteúdo do
banco local a partir das migrations e do seed.
