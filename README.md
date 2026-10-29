# Todolist — React + Fastify + MySQL

Sistema de lista de tarefas com a interface das imagens de referência (tema escuro, logo "to*do.*", busca, contadores e modal de criação).

## Estrutura

```
todolist/
├── backend/     # API em Fastify + MySQL
└── frontend/    # Interface em React (Vite + Tailwind)
```

## 1. Banco de dados (MySQL)

Crie o banco e a tabela executando o script:

```bash
mysql -u root -p < backend/schema.sql
```

(O backend também cria a tabela automaticamente ao iniciar, caso ainda não exista.)

## 2. Backend (Fastify)

```bash
cd backend
cp .env.example .env
# edite o .env com usuário/senha do seu MySQL
npm install
npm run dev
```

A API sobe em `http://localhost:3333`.

### Endpoints

| Método | Rota               | Descrição                                   |
| ------ | ------------------ | ------------------------------------------- |
| GET    | /api/tasks?search= | Lista tarefas (com busca opcional)          |
| POST   | /api/tasks         | Cria tarefa `{ title, description?, dueDate? }` |
| PATCH  | /api/tasks/:id     | Atualiza `{ completed?, title?, description?, dueDate? }` |
| DELETE | /api/tasks/:id     | Remove uma tarefa                           |

## 3. Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3333
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Funcionalidades

- Listagem de tarefas com contadores de total e concluídas
- Busca de tarefas em tempo real (com debounce)
- Criação de tarefas via modal ("Create Task"), com data limite opcional
- Edição de tarefas via modal ("Edit Task") — botão de lápis em cada item
- Marcar/desmarcar tarefa como concluída (checkbox com gradiente)
- Exclusão de tarefas (botões de editar/excluir aparecem ao passar o mouse)
- **Data limite e atraso**: tarefas com data de vencimento no passado e ainda pendentes ficam com o título em vermelho e exibem o selo "Em atraso"
- Ordenação automática: tarefas com data mais próxima aparecem primeiro
- Estado vazio idêntico ao mockup ("You have no pending tasks.")
- Botão flutuante "+" no canto inferior direito
- Interface em português, com prazo em dias ("Expira em 2 dias", "Venceu há 3 dias")
- Descrição opcional em cada tarefa (também entra na busca)
- Tema claro/escuro alternável (a escolha fica salva no navegador)
