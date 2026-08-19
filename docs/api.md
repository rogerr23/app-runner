# API HTTP

Todos os corpos e respostas usam JSON. Rotas protegidas exigem a sessão criada
pelos endpoints de autenticação. Datas e horários seguem ISO 8601.

## Respostas de erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Os dados enviados são inválidos."
  }
}
```

Erros esperados usam `400`, `401`, `403` ou `404`. Falhas inesperadas retornam
`500` sem expor detalhes internos.

## Saúde

### `GET /api/health`

Não exige autenticação. Confirma que o processo Next.js está respondendo.

## Autenticação

### `POST /api/auth/signup`

```json
{
  "displayName": "Ana Corredora",
  "email": "ana@example.com",
  "password": "corrida123"
}
```

### `POST /api/auth/login`

```json
{
  "email": "ana@example.com",
  "password": "corrida123"
}
```

### `POST /api/auth/logout`

Encerra a sessão atual e retorna `204`.

## Perfil

- `GET /api/profile`: retorna o próprio perfil;
- `PATCH /api/profile`: altera nome, experiência, objetivo ou meta semanal.

```json
{
  "experienceLevel": "beginner",
  "primaryGoal": "run_5k",
  "weeklyGoalKm": 10
}
```

## Corridas realizadas

- `GET /api/runs?limit=20&offset=0`: histórico paginado;
- `POST /api/runs`: registra uma corrida;
- `PATCH /api/runs/:id`: altera uma corrida;
- `DELETE /api/runs/:id`: remove uma corrida.

```json
{
  "plannedRunId": null,
  "performedAt": "2026-08-19T07:30:00-03:00",
  "runType": "easy",
  "distanceKm": 5,
  "durationSeconds": 1800,
  "perceivedEffort": 3,
  "notes": "Corrida confortável"
}
```

## Corridas planejadas

- `GET /api/planned-runs`: lista planejamentos;
- `POST /api/planned-runs`: cria um planejamento;
- `PATCH /api/planned-runs/:id`: altera dados ou status;
- `DELETE /api/planned-runs/:id`: remove um planejamento.

```json
{
  "scheduledFor": "2026-08-22",
  "runType": "long",
  "targetDistanceKm": 8,
  "notes": "Manter ritmo confortável"
}
```

## Metas

- `GET /api/goals`: lista metas;
- `POST /api/goals`: cria uma meta;
- `PATCH /api/goals/:id`: altera dados ou status;
- `DELETE /api/goals/:id`: remove uma meta.

```json
{
  "kind": "weekly_distance",
  "title": "Correr 15 km por semana",
  "targetValue": 15,
  "unit": "km",
  "startsOn": "2026-08-19"
}
```

Os nomes do contrato HTTP usam `camelCase`; o banco utiliza `snake_case`. A API
faz a conversão explicitamente.
