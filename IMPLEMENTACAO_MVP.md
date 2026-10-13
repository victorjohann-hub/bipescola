# Guia de Implementação e Checklist Técnico - MVP BIP Escola

> **Objetivo do MVP**: Garantir o ciclo essencial de presença/check-in via QR Code e chamada manual, gerenciamento administrativo completo (Usuários, Alunos e Turmas), autenticação com recuperação/troca de senha e visualização de perfil.

---

## 🔍 1. Relatório de Varredura do Repositório (Status Atual)

Antes de iniciar as tarefas, foi realizada uma varredura completa no código atual. Segue o status real de cada item:

| Componente | Funcionalidade | Status | Detalhes no Código |
|---|---|---|---|
| **Front-end** | Atalho "Novo Cadastro" no Admin | ✅ **Concluído** | `AdminMenuScreen.js` já possui o card direcionando para `RegisterScreen`. |
| **Front-end** | Modal de Edição Real de Usuários | ✅ **Concluído** | `UserManagementScreen.js` já possui modal funcional chamando `PUT /api/users/:id`. |
| **Front-end** | Modal de Edição Real de Alunos | ✅ **Concluído** | `StudentManagementScreen.js` já possui modal funcional chamando `PUT /api/students/:id`. |
| **Front-end** | Link "Esqueceu sua senha?" | ✅ **Concluído** | `LoginScreen.js` já navega para `ResetPasswordScreen`. |
| **Front-end** | Link "Alterar Senha" no Perfil | ✅ **Concluído** | `ProfileScreen.js` já navega para `ResetPasswordScreen`. |
| **Front-end** | Filtro de Turmas na Chamada Manual | 🔴 **Pendente** | `ClassListScreen.js` carrega todos os alunos sem filtro de turma. |
| **Front-end** | Tela "Gerenciar Turmas" no Admin | 🔴 **Pendente** | Aguarda entrega dos endpoints do back-end. |
| **Banco / SQL** | Role `PORTEIRO` no ENUM de users | 🔴 **Pendente** | `database.sql` restringe role a `('PROF', 'ADM', 'PARENT')`. |
| **Banco / SQL** | Campos de Recuperação de Senha | 🔴 **Pendente** | Tabela `users` não possui `reset_token` e `reset_token_expires`. |
| **Banco / SQL** | Campo `foto` na tabela `users` | 🔴 **Pendente** | Tabela `users` não possui coluna para avatar/foto. |
| **Banco / SQL** | Campo `destinatario_id` em `posts` | 🔴 **Pendente (Opcional)** | Tabela `posts` não possui FK para direcionar avisos individuais. |
| **Back-end** | CRUD de Turmas (`/api/turmas`) | 🔴 **Pendente** | Não existem model, service, controller ou rotas de turmas. |
| **Back-end** | Role `PORTEIRO` em Presenças | 🔴 **Pendente** | `attendanceRoutes.js` permite apenas `('ADM', 'PROF')`. |
| **Back-end** | Rotas de Troca e Recuperação de Senha | 🔴 **Pendente** | Não existem `change-password`, `forgot-password`, `reset-password`. |
| **Back-end** | Rota de Atualização de Foto de Perfil | 🔴 **Pendente** | Não existe endpoint `PUT /api/users/:id/photo`. |
| **Back-end** | Filtro de Destinatário nos Avisos | 🔴 **Pendente (Opcional)** | `postController.js` não processa destinatário. |

---

## 🗄️ 2. Banco de Dados (MySQL) - Scripts DDL Necessários

Execute os seguintes comandos SQL no banco de dados da aplicação (`bipescola`):

- [ ] **2.1. Adicionar Role `PORTEIRO`**
  ```sql
  ALTER TABLE users 
  MODIFY COLUMN role ENUM('PROF', 'ADM', 'PARENT', 'PORTEIRO') NOT NULL DEFAULT 'PARENT';
  ```

- [ ] **2.2. Adicionar Campos de Recuperação de Senha na Tabela `users`**
  ```sql
  ALTER TABLE users 
  ADD COLUMN reset_token VARCHAR(255) NULL AFTER firstLogin,
  ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token;
  ```

- [ ] **2.3. Adicionar Coluna de Foto/Avatar na Tabela `users`**
  ```sql
  ALTER TABLE users 
  ADD COLUMN foto VARCHAR(255) NULL AFTER aniversario;
  ```

- [ ] **2.4. (Opcional para MVP) Segmentação de Avisos na Tabela `posts`**
  ```sql
  ALTER TABLE posts 
  ADD COLUMN destinatario_id INT NULL AFTER autor_id,
  ADD CONSTRAINT fk_posts_destinatario FOREIGN KEY (destinatario_id) REFERENCES users(id) ON DELETE CASCADE;
  ```

---

## ⚙️ 3. Back-end (Node.js & Express)

### 3.1. Módulo de Turmas (`/api/turmas`)
- [ ] **Criar `backend/src/models/turmaModel.js`**:
  - `findAll()`: `SELECT * FROM turmas ORDER BY nome ASC`
  - `findById(id)`: `SELECT * FROM turmas WHERE id = ?`
  - `create({ nome, status })`: `INSERT INTO turmas (nome, status) VALUES (?, ?)`
  - `update(id, { nome, status })`: `UPDATE turmas SET nome = ?, status = ? WHERE id = ?`
  - `deleteById(id)`: `DELETE FROM turmas WHERE id = ?`
- [ ] **Criar `backend/src/services/turmaService.js`**:
  - Validação de duplicação de nome de turma.
  - Verificação se existem alunos vinculados antes de permitir exclusão (`turma_id` em `alunos`).
- [ ] **Criar `backend/src/controllers/turmaController.js`**:
  - Métodos: `listTurmas`, `getTurma`, `createTurma`, `updateTurma`, `deleteTurma`.
- [ ] **Criar `backend/src/routes/turmaRoutes.js`**:
  - `GET /`: autenticado (`authMiddleware`).
  - `GET /:id`: autenticado (`authMiddleware`).
  - `POST /`: restrito a Admin (`authMiddleware`, `roleMiddleware('ADM')`).
  - `PUT /:id`: restrito a Admin (`authMiddleware`, `roleMiddleware('ADM')`).
  - `DELETE /:id`: restrito a Admin (`authMiddleware`, `roleMiddleware('ADM')`).
- [ ] **Registrar no `backend/app.js`**:
  - Importar `turmaRoutes` e adicionar `app.use('/api/turmas', turmaRoutes);`.

---

### 3.2. Autorização da Role `PORTEIRO`
- [ ] **Atualizar `backend/src/routes/attendanceRoutes.js`**:
  - Alterar a permissão da rota de registro de presença:
    ```javascript
    router.post(
      "/",
      authMiddleware,
      roleMiddleware("ADM", "PROF", "PORTEIRO"),
      createAttendance
    );
    ```

---

### 3.3. Perfil e Gerenciamento de Senha
- [ ] **Criar endpoint de alteração de senha: `PUT /api/users/change-password`**:
  - Rota protegida por `authMiddleware`.
  - Recebe `{ senhaAtual, novaSenha }`.
  - Valida se `senhaAtual` bate com o hash bcrypt do `req.user.id`.
  - Gera novo hash bcrypt e atualiza `senha` do usuário.
- [ ] **Criar fluxo de recuperação de senha**:
  - `POST /api/users/forgot-password`: Recebe `{ email }`. Se existir, gera token aleatório (ex: `crypto.randomBytes(20).toString('hex')`) ou código temporário, grava em `reset_token` com validade de 1 hora em `reset_token_expires`. (Retorna status 200).
  - `POST /api/users/reset-password`: Recebe `{ email, token, novaSenha }` ou redefine senha direta via token válido.
- [ ] **Criar endpoint de foto de perfil: `PUT /api/users/:id/photo`**:
  - Recebe URL/caminho da imagem `{ foto }` ou salva via upload e atualiza o campo `foto` no banco.

---

### 3.4. (Opcional para MVP) Ajustes no Módulo de Posts/Avisos
- [ ] **Atualizar `backend/src/controllers/postController.js`**:
  - `createPost`: extrair `destinatario_id` do `req.body` e repassar para `postService`.
  - `listPosts`: se `req.user.role === 'PARENT'`, filtrar `WHERE destinatario_id IS NULL OR destinatario_id = ?`.

---

## 📱 4. Front-end (React Native & Expo)

### 4.1. Filtro de Turmas na Chamada Manual (`ClassListScreen.js`)
- [ ] **Adicionar integração com turmas**:
  - Criar função `listTurmasAPI()` em `mobile/src/shared/api/schoolApi.js` (`GET /api/turmas`).
- [ ] **Atualizar `mobile/src/pages/Presence/ui/screens/ClassListScreen.js`**:
  - Adicionar seletor/chips horizontais de turmas no topo da tela.
  - Ao selecionar uma turma específica, filtrar a lista de estudantes pelo `turma_id` ou chamar `GET /api/students/turma/:id`.
  - Opção "Todas as Turmas" para visão geral rápida.

---

### 4.2. Tela Administrativa de "Gerenciar Turmas" (`ClassManagementScreen.js`)
- [ ] **Criar API wrappers em `mobile/src/shared/api/adminApi.js`**:
  - `listTurmasAPI()`, `createTurmaAPI(data)`, `updateTurmaAPI(id, data)`, `deleteTurmaAPI(id)`.
- [ ] **Criar `mobile/src/pages/Admin/ui/ClassManagementScreen.js`**:
  - Listagem de todas as turmas cadastradas com badge de status (`ativa`/`inativa`).
  - Botão de adicionar nova turma (abre modal com nome e status).
  - Ações por card: Editar turma (modal) e Excluir turma (com alerta de confirmação).
- [ ] **Registrar rota no `mobile/src/pages/Admin/navigation/AdminNavigator.js`**:
  - Adicionar `<Stack.Screen name="ClassManagement" component={ClassManagementScreen} />`.
- [ ] **Adicionar card no menu em `mobile/src/pages/Admin/ui/AdminMenuScreen.js`**:
  - Adicionar card "Gerenciar Turmas" apontando para `navigation.navigate('ClassManagement')`.

---

### 4.3. Conectar Troca de Senha Real
- [ ] **Criar função de API em `mobile/src/shared/api/userApi.js`**:
  - `changePasswordAPI({ senhaAtual, novaSenha })`.
  - `resetPasswordAPI({ email, novaSenha })`.
- [ ] **Atualizar `mobile/src/pages/ResetPassword/ui/ResetPasswordScreen.js`**:
  - Conectar o botão "Confirmar Nova Senha" para disparar a chamada real de API e exibir feedback.

---

## 🧪 5. Roteiro de Testes e Validação do MVP

Execute a validação na seguinte sequência:

1. **Validação do Porteiro**:
   - Criar usuário com role `PORTEIRO`.
   - Logar com o usuário Porteiro no app: certificar que apenas a aba Presença está disponível.
   - Escanear o QR Code de um aluno: confirmar que a API `POST /api/attendances` retorna 201 e não 403.
2. **Validação de Turmas**:
   - Como Administrador, acessar Painel ADM -> Gerenciar Turmas.
   - Criar uma turma (ex: "Turma 2 - Vespertino").
   - Acessar Gerenciar Alunos, editar um aluno e associá-lo à nova turma.
   - Acessar a Chamada Manual e verificar se o filtro por turma exibe apenas os alunos corretos.
3. **Validação de Senha**:
   - Acessar Perfil -> Alterar Senha -> Inserir nova senha e validar se o próximo login exige a senha alterada.
