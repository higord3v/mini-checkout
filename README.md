# Mini Checkout - Projeto Spec Driven Development (Github SpecKit)

Um simulador local full-stack de compra de capinhas de celular, com validação, estoque em memória,
feedback de processamento assíncrono e uma interface de checkout em React.

## Decisões / Trade-offs

- MVP: foi priorizada a velocidade de desenvolvimento em vez da complexidade técnica
- Banco de Dados: em memória para validação e configuração rápidas
- SDD: utilizado por ter curva de aprendizado rápida e acelerar a produtividade
- STACK: apesar do TypeScript adicionar complexidade, foi escolhido por trazer mais segurança e qualidade na entrega

## Tech stack

| Camada   | Tecnologias                |
|----------|----------------------------|
| Backend  | Node.js, TypeScript, Express, Zod |
| Frontend | React, TypeScript, Vite   |
| Testes Backend  | Jest, Supertest        |
| Testes Frontend | Vitest, React Testing Library |

## Arquitetura

- **Monorepo** com `backend/` e `frontend/` na raiz do repositório.
- **Backend**: rotas → controllers → services → repositório em memória; validação com Zod;
  middleware centralizado de erro mapeando status HTTP.
- **Frontend**: camada de serviços (`productService`, `purchaseService`) sobre um
  `api/client` compartilhado; componentes de UI não fazem chamadas `fetch` diretamente.
- **TDD**: testes escritos antes da implementação conforme a constituição do projeto.

## Estrutura de pastas

```text
backend/src/     API, lógica de negócio, validação
backend/tests/   Testes unitários e de integração (Jest)
frontend/src/    UI em React, hooks, serviços
frontend/tests/  Testes de componentes (Vitest)
specs/           Documentação de funcionalidades (Spec Kit)
