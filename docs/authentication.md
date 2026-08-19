# Autenticação e segurança

## Fluxo

1. O cliente envia nome, e-mail e senha para `POST /api/auth/signup`.
2. Supabase Auth cria o usuário.
3. Um trigger cria seu registro em `public.profiles`.
4. O Supabase devolve uma sessão, armazenada em cookies pelo cliente SSR.
5. Em chamadas protegidas, `auth.getUser()` valida a identidade no servidor.
6. O JWT acompanha a consulta e `auth.uid()` é avaliado pelas políticas RLS.

## Ambiente local

A confirmação de e-mail está desabilitada apenas na configuração local para
facilitar os testes. E-mails locais são capturados pelo Mailpit e não são enviados
para a internet. A caixa local fica em `http://localhost:54324`.

## Protótipo hospedado

Para três contas privadas, há duas alternativas:

- criar as contas em uma sessão controlada e manter confirmação desabilitada;
- configurar SMTP próprio e habilitar confirmação de e-mail.

O provedor de e-mail padrão do Supabase possui limites baixos e não deve ser
tratado como infraestrutura de produção.

## Chaves

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: identifica o projeto e pode ser usada
  no cliente quando todas as tabelas estão protegidas por RLS;
- `SUPABASE_SECRET_KEY`: ignora RLS e só deve existir em processos administrativos
  confiáveis. Nenhum endpoint comum deste projeto usa essa chave.

## RLS

As tabelas `profiles`, `planned_runs`, `runs` e `goals` filtram linhas por
`auth.uid()`. Os testes em `supabase/tests/database` simulam dois usuários e
confirmam que referências e inserts cruzados são bloqueados.

## Checklist antes de produção

- habilitar confirmação de e-mail e configurar SMTP;
- revisar URLs permitidas de redirecionamento;
- habilitar MFA na conta administrativa do Supabase;
- adicionar proteção contra abuso e rate limiting na borda;
- revisar logs sem registrar tokens, senhas ou payloads sensíveis;
- executar novamente os testes RLS após cada alteração no schema.
