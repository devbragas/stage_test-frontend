# Stage Flow – Frontend

Frontend do sistema de mapeamento e visualização da cadeia de processos organizacionais.
Desenvolvido como parte do case técnico da Stage Consulting, utilizando majoritariamente Next.js.

## 1. Objetivo do Projeto

O sistema permite organizar áreas, processos e subprocessos em uma estrutura hierárquica visual, com foco em usabilidade, organização modular e escalabilidade.

## 2. Tecnologias Utilizadas

- Next.js 16
- React
- TypeScript
- React Hook Form
- Zod
- TanStack Query
- Zustand
- Axios
- Tailwind CSS
- shadcn/ui

## 3. Arquitetura

A aplicação segue uma estrutura feature-based (FDD – Feature Driven Design),
havendo uma clara separação de responsabilidades seguindo um mesmo padrão:

```bash
src/
 ├── app/
 ├── features/
 │    ├── areas/
 │    └── processes/
 ├── shared/
 │    ├── components/
 │    ├── hooks/
 │    └── utils/
 ├── lib/
```

Nesse padrão de arquitetura, cada domínio possui sua própria responsabilidade, tendo todo o código centralizado e com fácil manutenibilidade.

## 4. Principais funcionalidades

### Áreas

- CRUD completo
- Filtro por nome
- Validação de nome duplicado
- Feedback visual com toast e Modals

### Processos

- CRUD completo
- Hierarquia (processo pai / subprocesso)
- Filtro por Nome e Área
- Paginação
- Exibição de Status, Prioridade, Área associada e indicador de subprocesso

- Gestão dinâmica de ferramentas, profissionais e documentações

### UX

- Badges visuais para Status e Prioridades
- Ícones para diferenciar tipo de processo (Manual / Sistêmico)
- Feedback de loading com Skeleton Screens
- Layout responsivo

## 5. Como rodar o projeto

Primeiramente, clone o repositório com o seguinte comando:

```bash
git clone https://github.com/devbragas/stage_test-frontend/tree/main
```

Em seguida, instale as dependências requeridas pelo terminal, para que a aplicação funcione bem, utilizando do comando:

```bash
npm install
```

Logo após isso, crie um arquivo .env na raíz do seu projeto e cole a seguinte linha:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Por fim, rode a aplicação com o comando:

```bash
npm run dev
```

A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000) .
