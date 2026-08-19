# ADR 001: Stack do MVP

- Status: aceita
- Data: 2026-08-19

## Contexto

O produto precisa ser demonstrável no celular por três pessoas, ter cadastro e
dados isolados, custar pouco e continuar compreensível para novos colaboradores.

## Decisão

Usar Next.js com TypeScript para aplicação e backend, Supabase para PostgreSQL e
autenticação, e Vercel como destino inicial de hospedagem.

## Motivos

- uma única linguagem na aplicação reduz a carga operacional do MVP;
- PostgreSQL oferece constraints, transações e RLS maduras;
- Supabase fornece ambiente local e hospedado com migrations versionáveis;
- Next.js permite evoluir a mesma base para a interface mobile-first;
- os planos gratuitos atendem ao teste privado de baixo volume.

## Consequências

- o projeto depende dos contratos de Next.js e Supabase;
- RLS passa a ser parte crítica e precisa de testes permanentes;
- o plano gratuito do Supabase pode pausar por inatividade;
- Vercel Hobby não deve ser usado para atividade comercial;
- recursos nativos como GPS contínuo podem exigir uma aplicação móvel no futuro.

## Alternativas consideradas

- backend Node.js separado: mais controle, porém mais implantação e código para o
  estágio atual;
- Firebase: acelera autenticação, mas o modelo relacional e as políticas SQL são
  mais naturais para o domínio escolhido;
- aplicação móvel nativa: melhor para GPS, porém desnecessária para validar o
  fluxo manual do primeiro MVP.
