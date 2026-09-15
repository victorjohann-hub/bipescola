# BipEscola - Sistema de Controle de Presença Escolar

Sistema completo para registrar e gerenciar entrada/saída de alunos em escola municipal via QR Code ou confirmação manual.

---

## Visão Geral

**Objetivo:** Automatizar o registro de presença escolar com dois métodos:
1. QR Code - Leitura rápida quando aluno entra/sai
2. Confirmação Manual - Lista de checkbox para confirmar presença em lote

**Usuarios (Roles):**
- **PARENT** - Pais/Responsáveis: Veem apenas seus filhos
- **PROF** - Professores/Coordenadores: Veem todos, geram relatórios
- **ADM** - Administradores: Acesso total ao sistema

---

## Stack Tecnológico

**Backend:**
- Node.js + Express 5.2.1
- MySQL 2 (mysql2/promise)
- JWT para autenticação
- Bcrypt para senhas

**Dependências:**
```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mysql2": "^3.24.4"
}
```

---

## Estrutura do Projeto

```
bipescola/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── controllers/
│       │   ├── userController.js
│       │   ├── studentController.js
│       │   ├── parentController.js
│       │   ├── teacherController.js
│       │   ├── admController.js
│       │   └── schoolController.js
│       ├── models/
│       ├── services/
│       ├── routes/
│       ├── middlewares/
│       └── database/
├── database.sql
└── README.md
```

---

## Banco de Dados

### Setup

```bash
mysql -u root -p < database.sql
```

### Tabelas

#### 1. TURMAS
```sql
CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,     -- ex: "1º Ano A"
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ativa', 'inativa') DEFAULT 'ativa'
);
```

#### 2. USERS
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,          -- hash bcrypt
    nome VARCHAR(255) NOT NULL,
    aniversario DATE,
    role ENUM('PROF', 'ADM', 'PARENT') NOT NULL,
    firstLogin BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo ENUM('sim', 'nao') DEFAULT 'sim'
);
```

Roles:
- **PROF** - Professor/Coordenador
- **ADM** - Admin (acesso total)
- **PARENT** - Pais/Responsáveis

#### 3. ALUNOS
```sql
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    aniversario DATE,
    turma_id INT NOT NULL,                -- qual turma
    id_pai INT,                           -- pai/responsável
    faltas INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('ativo', 'inativo', 'transferido', 'evadido') DEFAULT 'ativo',
    
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (id_pai) REFERENCES users(id)
);
```

#### 4. QR_CODES
```sql
CREATE TABLE qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    codigo_qr VARCHAR(255) NOT NULL UNIQUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo ENUM('sim', 'nao') DEFAULT 'sim',
    
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);
```

#### 5. REGISTROS_MOVIMENTACAO
```sql
CREATE TABLE registros_movimentacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    tipo_movimentacao ENUM('entrada', 'saida') NOT NULL,
    data_registro DATE NOT NULL,
    hora_registro TIME NOT NULL,
    data_hora_completa DATETIME NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes VARCHAR(255),
    
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);
```

### Normalizacao

- **1FN:** Todos valores são atômicos
- **2FN:** Sem dependências parciais
- **3FN:** Sem dependências transitivas
- **Integridade:** Chaves estrangeiras com ON DELETE RESTRICT/CASCADE

### Indices Críticos

- `alunos.idx_matricula` - Busca rápida por QR Code
- `registros_movimentacao.idx_aluno_data` - Verificar presença hoje
- `registros_movimentacao.idx_data_hora_completa` - Relatórios

### Dados de Teste

**Usuarios:**
- pai@email.com | 123456 | PARENT
- prof@emei.com | prof123 | PROF
- admin@emei.com | admin123 | ADM

**Alunos (MAT001-MAT006):**
- Turma 1º Ano A: João Silva Santos, Ana Paula Costa
- Turma 1º Ano B: Pedro Oliveira, Lucia Ferreira
- Turma 2º Ano A: Bruno Martins, Gabriela Rocha

**QR Codes:** QR_001_MAT001 até QR_006_MAT006

---

## API REST

### Base URL
```
http://localhost:3000/api
```

### Usuarios

#### POST /users/parents
Criar novo pai/responsavel.

**Request:**
```json
{
  "name": "Maria Silva",
  "email": "maria@email.com"
}
```

**Response (201):**
```json
{
  "message": "Conta criada",
  "tempPassword": "ABC123"
}
```

### Presenca (TO DO)

#### POST /attendance/qrcode
Registrar entrada/saída via QR Code.

**Request:**
```json
{
  "codigo_qr": "QR_001_MAT001",
  "tipo": "entrada"
}
```

#### POST /attendance/manual
Registrar presença em lote.

**Request:**
```json
{
  "aluno_ids": [1, 2, 3],
  "tipo_movimentacao": "entrada"
}
```

#### GET /attendance/historico/:matricula
Ver histórico de um aluno.

#### GET /attendance/presentes-hoje
Ver alunos presentes na escola hoje.

---

## SQL Essencial

Registrar entrada:
```sql
INSERT INTO registros_movimentacao 
(aluno_id, turma_id, tipo_movimentacao, data_registro, hora_registro, data_hora_completa)
SELECT a.id, a.turma_id, 'entrada', CURDATE(), CURTIME(), NOW()
FROM alunos a
WHERE a.matricula = 'MAT001' AND a.status = 'ativo';
```

Historico:
```sql
SELECT data_hora_completa, tipo_movimentacao, observacoes
FROM registros_movimentacao
WHERE matricula = 'MAT001'
ORDER BY data_hora_completa DESC;
```

Presentes hoje:
```sql
SELECT a.nome, rm.hora_registro
FROM registros_movimentacao rm
JOIN alunos a ON rm.aluno_id = a.id
WHERE rm.data_registro = CURDATE()
  AND rm.id = (SELECT MAX(id) FROM registros_movimentacao rm2 
               WHERE rm2.aluno_id = rm.aluno_id AND rm2.data_registro = CURDATE())
  AND rm.tipo_movimentacao = 'entrada'
ORDER BY a.nome;
```

Relatorio diario:
```sql
SELECT t.nome AS turma,
    COUNT(DISTINCT CASE WHEN rm.tipo_movimentacao = 'entrada' THEN rm.aluno_id END) AS presentes,
    COUNT(DISTINCT a.id) - COUNT(DISTINCT CASE WHEN rm.tipo_movimentacao = 'entrada' THEN rm.aluno_id END) AS ausentes
FROM alunos a
LEFT JOIN turmas t ON a.turma_id = t.id
LEFT JOIN registros_movimentacao rm ON a.id = rm.aluno_id AND rm.data_registro = CURDATE()
WHERE a.status = 'ativo'
GROUP BY t.id, t.nome;
```

Desativar aluno:
```sql
UPDATE alunos SET status = 'transferido' WHERE matricula = 'MAT001';
UPDATE qr_codes SET ativo = 'nao' WHERE aluno_id = (SELECT id FROM alunos WHERE matricula = 'MAT001');
```

---

## Como Executar

### Pré-requisitos
- Node.js v18+
- MySQL 8.0+
- npm

### Instalacao

1. **Crie o banco de dados**
```bash
mysql -u root -p < database.sql
```

2. **Instale dependências**
```bash
cd backend
npm install
```

3. **Configure .env**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=bipescola
JWT_SECRET=sua_chave_secreta
NODE_ENV=development
```

4. **Inicie o servidor**
```bash
npm start
```

Servidor: `http://localhost:3000`

---

## Permissoes por Role

| Acao | PARENT | PROF | ADM |
|------|--------|------|-----|
| Ver alunos | Filhos | Todos | Todos |
| Registrar presença | Filhos | Todos | Todos |
| Gerar relatorios | Não | Sim | Sim |
| Gerenciar usuarios | Não | Não | Sim |
| Gerenciar turmas | Não | Não | Sim |
| Deletar dados | Não | Não | Sim |

---

## Status de Desenvolvimento

### Implementado
- [x] Banco de dados (5 tabelas normalizadas)
- [x] Setup Express
- [x] Estrutura MVC
- [x] Criar pai/responsável

### Pendente
- [ ] Autenticação JWT
- [ ] Criar alunos
- [ ] Registrar presença (QR Code)
- [ ] Registrar presença (Manual)
- [ ] Consultar histórico
- [ ] Gerar relatórios
- [ ] Frontend
- [ ] Testes

---

## Licença

ISC

---

**Última atualização:** 10/09/2026
