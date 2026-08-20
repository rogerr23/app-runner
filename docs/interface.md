# Interface e fluxos

## Objetivo

A interface do Pista foi desenhada primeiro para celular e continua confortável
em telas grandes. Ela prioriza ações curtas: planejar uma corrida, registrar o
resultado e acompanhar a constância semanal. Não há dependência de GPS ou de um
relógio esportivo no MVP.

## Áreas da aplicação

- **Acesso:** criação de conta e login com e-mail e senha.
- **Início:** resumo da semana, próximo treino, atalhos e atividades recentes.
- **Planejar:** criação e exclusão de corridas planejadas.
- **Histórico:** métricas acumuladas, registro e exclusão de corridas realizadas.
- **Perfil:** dados pessoais, nível, objetivo principal, meta semanal e metas
  adicionais.

No celular, as quatro áreas ficam na navegação inferior e o botão flutuante abre
rapidamente o registro de corrida. No desktop, a navegação passa para a lateral.

## Integração com a API

O componente cliente em `src/app/page.tsx` não acessa o banco diretamente. Ele
usa os endpoints em `/api`, enviando o cookie de sessão automaticamente. Ao
abrir a página, uma chamada a `/api/profile` determina se existe uma sessão:

```text
sem sessão -> tela de acesso
com sessão -> perfil + corridas + planejamentos + metas -> painel
```

Depois de uma criação ou exclusão bem-sucedida, a tela busca os dados novamente.
Erros normalizados pela API são exibidos na própria interface.

## Sistema visual

O projeto usa uma paleta curta: verde floresta para estrutura e confiança,
verde-limão para progresso e ação, coral para destaques e um fundo em tom de
papel. Os ícones são do Lucide e a tipografia usa uma pilha de fontes do sistema,
evitando downloads adicionais.

A imagem `public/pista-social.png` é usada somente em previews de
compartilhamento Open Graph e Twitter. Ela foi gerada com o recurso integrado de
geração de imagens, usando a mesma direção de arte da interface.

## Próximas melhorias possíveis

- editar registros e planejamentos existentes;
- filtros por mês e tipo de corrida;
- gráficos de evolução de distância e ritmo;
- recuperação de senha e confirmação de e-mail para abertura pública;
- testes automatizados de ponta a ponta para os fluxos da interface.
