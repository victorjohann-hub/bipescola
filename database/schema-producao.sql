-- BipEscola: schema para PRODUCAO (somente tabelas, sem dados de exemplo).
-- Gerado a partir de database.sql. O banco ja deve existir e estar selecionado.

-- ============================================================================
-- TABELA: TURMAS
-- Descricao: Armazena as turmas da escola unica
-- ============================================================================
CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ativa', 'inativa') DEFAULT 'ativa',
    INDEX idx_nome (nome),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: USERS
-- Descricao: Armazena usuarios do sistema (professores, admin, pais)
-- Roles:
--   - PROF: Professor/Coordenacao
--   - ADM: Admin (acesso total)
--   - PARENT: Pais/responsaveis (veem apenas seus filhos)
--   - PORTEIRO: Porteiro/seguranca (registra presenca na portaria)
-- ============================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    aniversario DATE,
    role ENUM('PROF', 'ADM', 'PARENT', 'PORTEIRO') NOT NULL DEFAULT 'PARENT',
    firstLogin BOOLEAN DEFAULT true,
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL,
    foto VARCHAR(255) NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo ENUM('sim', 'nao') DEFAULT 'sim',

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: ALUNOS
-- Descricao: Armazena informacoes dos alunos
-- Relacionamento: Um aluno pertence a uma turma
-- Normalizacao: Sem dados redundantes, chaves primaria e estrangeira corretas
-- ============================================================================
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    aniversario DATE,
    turma_id INT NOT NULL,
    id_pai INT,
    faltas INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('ativo', 'inativo', 'transferido', 'evadido') DEFAULT 'ativo',

    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_pai) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,

    INDEX idx_matricula (matricula),
    INDEX idx_nome (nome),
    INDEX idx_turma_id (turma_id),
    INDEX idx_id_pai (id_pai),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: QR_CODES
-- Descricao: Armazena relacao entre QR Codes e alunos
-- ============================================================================
CREATE TABLE qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    codigo_qr VARCHAR(255) NOT NULL UNIQUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo ENUM('sim', 'nao') DEFAULT 'sim',

    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_codigo_qr (codigo_qr),
    INDEX idx_aluno_id (aluno_id),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: REGISTROS_MOVIMENTACAO
-- Descricao: Armazena registros de entrada e saida dos alunos
-- Normalizacao: Cada registro em linha separada, sem redundancia
-- ============================================================================
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

    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE RESTRICT ON UPDATE CASCADE,

    INDEX idx_aluno_id (aluno_id),
    INDEX idx_turma_id (turma_id),
    INDEX idx_data_registro (data_registro),
    INDEX idx_tipo_movimentacao (tipo_movimentacao),
    INDEX idx_data_hora_completa (data_hora_completa),
    INDEX idx_aluno_data (aluno_id, data_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: PRESENCAS
-- Descricao: Confirmacao manual de presenca diaria (metodo em lote/checkbox)
-- Diferenca de REGISTROS_MOVIMENTACAO: aqui eh um registro por aluno/dia,
-- usado quando o professor confirma presenca manualmente (sem QR Code)
-- ============================================================================
CREATE TABLE presencas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    data DATE NOT NULL,
    presente BOOLEAN NOT NULL DEFAULT TRUE,
    registrado_por INT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (registrado_por) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,

    UNIQUE (aluno_id, data),
    INDEX idx_aluno_id (aluno_id),
    INDEX idx_data (data),
    INDEX idx_registrado_por (registrado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA: POSTS
-- Descricao: Comunicados/avisos publicados por professores e administradores
-- destinatario_id: NULL = aviso geral; preenchido = aviso direcionado a um usuario
-- ============================================================================
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    autor_id INT NOT NULL,
    destinatario_id INT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (autor_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (destinatario_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,

    INDEX idx_autor_id (autor_id),
    INDEX idx_destinatario_id (destinatario_id),
    INDEX idx_data_criacao (data_criacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
