# App Runner

Aplicação web mobile-first para pessoas que correm ou querem começar a correr.
O projeto busca oferecer uma experiência simples para planejar treinos, registrar
corridas e acompanhar a evolução ao longo do tempo.

## Objetivo

O primeiro marco é um MVP funcional para validação com um pequeno grupo de
usuários. A experiência principal deve permitir:

- criar uma conta e definir um perfil de corredor;
- planejar corridas e treinos;
- registrar distância, duração e percepção de esforço;
- consultar o histórico de atividades;
- acompanhar metas e indicadores básicos de evolução.

Funcionalidades mais complexas, como GPS em tempo real, integrações com relógios,
feed social e pagamentos, não fazem parte da primeira versão.

## Stack planejada

- **Next.js e TypeScript:** aplicação web e camada de backend;
- **Supabase:** PostgreSQL, autenticação e políticas de acesso aos dados;
- **Tailwind CSS:** interface responsiva e orientada a dispositivos móveis;
- **Vercel:** hospedagem do protótipo;
- **Vitest e Playwright:** testes automatizados.

A infraestrutura inicial será compatível com os planos gratuitos dos serviços,
considerando o uso pessoal e não comercial do protótipo.

## Arquitetura e documentação

As decisões e instruções técnicas serão documentadas progressivamente em
[`docs/`](./docs). O banco será versionado por migrations, permitindo reproduzir
o ambiente sem depender de alterações manuais em painéis administrativos.

Nenhuma credencial deve ser adicionada ao repositório. Variáveis necessárias
serão apresentadas em um arquivo `.env.example`.

## Desenvolvimento

O desenvolvimento acontece na branch `develop`. A branch `main` representa a
versão estável e deve receber alterações por Pull Request.

As instruções completas de configuração local serão adicionadas junto com a
fundação técnica do projeto.

## Status

Em preparação: estrutura inicial, banco de dados, autenticação e documentação.

## Licença

Ainda não definida.
