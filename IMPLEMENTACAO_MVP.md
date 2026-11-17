# Guia de Implementação e Checklist Técnico - MVP BIP Escola

> **Status do MVP**: ✅ **100% CONCLUÍDO E VALIDADO**  
> Todas as funcionalidades essenciais do ciclo de presença (QR Code e Diário de Classe 1-Toque), gestão administrativa escolar (Usuários, Alunos e Turmas), autenticação com recuperação/troca de senha, controle RBAC e mural de avisos estão implementadas, testadas e documentadas.

---

## 🔍 1. Relatório de Varredura e Status Final do Repositório

| Componente | Funcionalidade | Status | Detalhes no Código |
|---|---|---|---|
| **Front-end** | Atalho "Novo Cadastro" no Admin | ✅ **Concluído** | `AdminMenuScreen.js` direciona para `RegisterScreen` com suporte a Responsável e Colaborador. |
| **Front-end** | Modal de Edição Real de Usuários | ✅ **Concluído** | `UserManagementScreen.js` possui modal funcional consumindo `PUT /api/users/:id`. |
| **Front-end** | Modal de Edição Real de Alunos | ✅ **Concluído** | `StudentManagementScreen.js` possui modal funcional com troca de turma e status consumindo `PUT /api/students/:id`. |
| **Front-end** | Link "Esqueceu sua senha?" | ✅ **Concluído** | `LoginScreen.js` navega para `ResetPasswordScreen`. |
| **Front-end** | Link "Alterar Senha" no Perfil | ✅ **Concluído** | `ProfileScreen.js` possui modal dedicado consumindo `PUT /api/users/change-password`. |
| **Front-end** | Filtro de Turmas na Chamada Manual | ✅ **Concluído** | `ClassListScreen.js` possui chips horizontais com contadores dinâmicos e botões rápidos 1-Tap de presença. |
| **Front-end** | Tela "Gerenciar Turmas" no Admin | ✅ **Concluído** | `ClassManagementScreen.js` implementa CRUD completo de salas com modal de criação/edição. |
| **Banco / SQL** | Role `PORTEIRO` no ENUM de users | ✅ **Concluído** | `database/database.sql` contém a role `PORTEIRO` com permissão estrita de portaria. |
| **Banco / SQL** | Campos de Recuperação de Senha | ✅ **Concluído** | Tabela `users` possui `reset_token` e `reset_token_expires` (DATETIME). |
| **Banco / SQL** | Campo `foto` na tabela `users` | ✅ **Concluído** | Tabela `users` possui coluna `foto` com endpoint `PUT /api/users/:id/photo`. |
| **Banco / SQL** | Campo `destinatario_id` em `posts` | ✅ **Concluído** | Tabela `posts` possui chave estrangeira para direcionar avisos individuais a responsáveis. |
| **Back-end** | CRUD de Turmas (`/api/class`, aliases) | ✅ **Concluído** | `classRoutes.js`, `classController.js`, `classService.js`, `classModel.js` com validação de integridade. |
| **Back-end** | Role `PORTEIRO` em Presenças | ✅ **Concluído** | `attendanceRoutes.js` autoriza `ADM`, `PROF` e `PORTEIRO` para lançamentos. |
| **Back-end** | Rotas de Troca e Recuperação de Senha | ✅ **Concluído** | Endpoints `change-password`, `forgot-password`, `reset-password` implementados e testados. |
| **Back-end** | Rota de Atualização de Foto de Perfil | ✅ **Concluído** | `PUT /api/users/:id/photo` implementado com verificação de autorização. |
| **Back-end** | Filtro de Destinatário nos Avisos | ✅ **Concluído** | `postController.js` segmenta avisos para perfil `PARENT` e garante privacidade. |

---

## 🗄️ 2. Banco de Dados (MySQL) - Scripts DDL Aplicados

O arquivo oficial [`database/database.sql`](database/database.sql) foi atualizado com todas as definições estruturais e senhas em hashes Bcrypt autênticos:

- [x] **2.1. Adicionar Role `PORTEIRO`**
  ```sql
  ALTER TABLE users 
  MODIFY COLUMN role ENUM('PROF', 'ADM', 'PARENT', 'PORTEIRO') NOT NULL DEFAULT 'PARENT';
  ```
- [x] **2.2. Campos de Recuperação de Senha na Tabela `users`**
  ```sql
  ALTER TABLE users 
  ADD COLUMN reset_token VARCHAR(255) NULL AFTER firstLogin,
  ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token;
  ```
- [x] **2.3. Coluna de Foto/Avatar na Tabela `users`**
  ```sql
  ALTER TABLE users 
  ADD COLUMN foto VARCHAR(255) NULL AFTER aniversario;
  ```
- [x] **2.4. Segmentação de Avisos na Tabela `posts`**
  ```sql
  ALTER TABLE posts 
  ADD COLUMN destinatario_id INT NULL AFTER autor_id,
  ADD CONSTRAINT fk_posts_destinatario FOREIGN KEY (destinatario_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
  ```

---

## ⚙️ 3. Back-end (Node.js & Express)

- [x] **3.1. Módulo de Turmas (`/api/class`, `/api/classes`, `/api/turmas`)**:
  - `classModel.js`: listagem, busca por id, criação, contagem de alunos vinculados e exclusão segura.
  - `classService.js`: bloqueio de exclusão de turmas com alunos matriculados (`statusCode: 400`).
  - `classController.js`: validação de entrada, status HTTP padronizados e aliases no `app.js`.
- [x] **3.2. Autorização da Role `PORTEIRO`**:
  - Integrada em `roleMiddleware('ADM', 'PROF', 'PORTEIRO')` nas rotas de presença e listagem de turmas.
- [x] **3.3. Perfil e Gerenciamento de Senha**:
  - `PUT /api/users/change-password` validando senha antiga com Bcrypt.
  - `POST /api/users/forgot-password` gerando tokens criptográficos com expiração em 1 hora.
  - `POST /api/users/reset-password` validando expiração e gravando novo hash.
  - `PUT /api/users/:id/photo` para avatar personalizado.
- [x] **3.4. Segmentação de Avisos**:
  - Usuários `PARENT` recebem apenas comunicados globais ou direcionados a si.

---

## 📱 4. Front-end (React Native & Expo)

- [x] **4.1. Filtro de Turmas na Chamada Manual (`ClassListScreen.js`)**:
  - Chips de seleção rápida com contador dinâmico de estudantes.
  - Botões diretos 1-Tap de **Presente** e **Falta** com confirmação de áudio/bipe e persistência instantânea.
- [x] **4.2. Gestão de Turmas (`ClassManagementScreen.js`)**:
  - Listagem em cards com badge de status e contagem de turmas.
  - Modal para criar nova turma e editar turmas existentes.
  - Ação de exclusão protegida com diálogo de confirmação.
- [x] **4.3. Fluxo Real de Recuperação e Troca de Senha**:
  - `ResetPasswordScreen.js` com fluxo em duas etapas (solicitação de código e redefinição com confirmação).
  - `ProfileScreen.js` com modal de troca de senha imediata e seletor rápido de fotos de avatar.
- [x] **4.4. Eliminação de AI Slop e Ajuste de Fuso Horário**:
  - Removidos campos fantasmas e mockups sem estado de `ParentRegister.js`.
  - Implementado utilitário `getLocalDateString` em `mobile/src/shared/utils/dateUtils.js`, eliminando o bug de virada de dia em UTC após as 21h.

---

## 🧪 5. Roteiro de Validação e Testes Automatizados

- **Suíte de Testes do Backend**: 251 testes passando em 17 suítes (100% de sucesso).
- **Suíte de Testes do Mobile**: 17 testes passando em 5 suítes (100% de sucesso).
