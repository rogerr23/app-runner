# Banco de dados

## Modelo

### `profiles`

Extensão dos usuários do Supabase Auth. Guarda nome, experiência, objetivo
principal e meta semanal. O identificador é o mesmo de `auth.users`.

### `planned_runs`

Treinos futuros. Exige ao menos uma distância ou duração alvo e possui os
estados `planned`, `completed` e `cancelled`.

### `runs`

Atividades realizadas. Guarda distância, duração, tipo de treino, esforço e
observações. `pace_seconds_per_km` é uma coluna gerada pelo PostgreSQL, portanto
não pode ser alterada pelo cliente.

Uma corrida pode apontar para um planejamento. A política do banco impede que
um usuário associe sua atividade ao planejamento de outra pessoa. Um trigger
marca o planejamento relacionado como concluído na mesma transação do registro.

### `goals`

Metas de distância semanal, frequência, distância de evento ou ritmo alvo.

## Convenções

- identificadores UUID gerados pelo banco;
- datas e horas em `timestamptz`, armazenadas de maneira independente do fuso;
- datas sem horário em `date`;
- distâncias em quilômetros;
- durações e ritmos em segundos;
- nomes internos em inglês e `snake_case`;
- `created_at` e `updated_at` em todas as entidades.

## Migrations

O schema é definido em `supabase/migrations`. Mudanças não devem ser feitas
apenas pelo Supabase Studio, pois seriam impossíveis de reproduzir.

Para criar uma migration:

```bash
npx supabase migration new nome_da_mudanca
```

Depois de editá-la:

```bash
npm run db:reset
npm run db:lint
npm run db:test
npm run db:types
```

O reset apaga somente o banco Supabase local. Nunca execute um reset contra um
projeto remoto.

## Dados de demonstração

O `seed.sql` base é intencionalmente vazio. Usuários de teste devem ser criados
pela API de Auth, e não por inserts diretos em `auth.users`, cujo schema interno
pode mudar. Depois do cadastro, dados de corrida podem ser criados pela API.

## Backup

O plano gratuito não substitui uma estratégia de backup. Antes do teste público,
defina exportações regulares e um procedimento de restauração. Migrations
reconstroem o schema, mas não recuperam dados inseridos pelos usuários.
