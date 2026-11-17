# Modelagem do Banco de Dados - BipEscola

> **Sistema**: BipEscola - Controle de Presença e Gestão Escolar  
> **SGBD**: MySQL 8.0+  
> **Normalização**: 1FN, 2FN, 3FN  
> **Integridade**: Chaves estrangeiras com `ON DELETE CASCADE` / `SET NULL` / `RESTRICT` e índices dedicados.

---

## 1. Visão Geral das Tabelas

O banco de dados oficial do sistema (`database/database.sql`) organiza os dados em torno das seguintes tabelas:

1. **`turmas`**: Séries e turmas escolares ativas e inativas.
2. **`users`**: Contas institucionais e acessos (`ADM`, `PROF`, `PORTEIRO`, `PARENT`).
3. **`alunos`**: Estudantes matriculados, vinculados a uma turma e a um responsável legal.
4. **`presencas`**: Registro diário de frequência escolar (chamada manual e leitura óptica QR Code).
5. **`posts`**: Mural de comunicados oficiais e recados individuais para responsáveis.
6. **`qr_codes`** *(legado/suporte)*: Mapeamento de códigos ópticos físicos de alunos.
7. **`registros_movimentacao`** *(legado/suporte)*: Trilha histórica de eventos de portaria com marcação de entrada/saída.

---

## 2. Tabelas em Uso Ativo pelo Sistema

### 2.1. `turmas`
Armazena a estrutura de salas e classes da instituição de ensino.

| Coluna | Tipo | Modificadores | Descrição |
|---|---|---|---|
| `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único da turma |
| `nome` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Nome da turma (Ex: "1º Ano A", "Infantil II") |
| `data_criacao` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data/hora de cadastro da turma |
| `status` | `ENUM('ativa', 'inativa')`| `DEFAULT 'ativa'` | Situação operacional da sala |

- **Índices**: `idx_nome`, `idx_status`.
- **Integridade**: Impedida a exclusão quando há alunos matriculados vinculados (`ON DELETE RESTRICT`).

---

### 2.2. `users`
Contas institucionais com controle RBAC por cargo, recuperação de senha e avatar.

| Coluna | Tipo | Modificadores | Descrição |
|---|---|---|---|
| `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único do usuário |
| `email` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | E-mail institucional de login |
| `senha` | `VARCHAR(255)` | `NOT NULL` | Hash da senha (Bcrypt salt 10) |
| `nome` | `VARCHAR(255)` | `NOT NULL` | Nome completo |
| `aniversario` | `DATE` | `NULL` | Data de nascimento |
| `role` | `ENUM('PROF', 'ADM', 'PARENT', 'PORTEIRO')` | `NOT NULL DEFAULT 'PARENT'` | Perfil de permissão RBAC |
| `firstLogin` | `BOOLEAN` | `DEFAULT TRUE` | Flag de primeiro acesso |
| `reset_token` | `VARCHAR(255)` | `NULL` | Token criptográfico para recuperação de senha |
| `reset_token_expires` | `DATETIME` | `NULL` | Data/hora de expiração do token de recuperação |
| `foto` | `VARCHAR(255)` | `NULL` | URL da foto/avatar do perfil |
| `data_criacao` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data de cadastro |
| `data_atualizacao`| `TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` | Última modificação |
| `ativo` | `ENUM('sim', 'nao')` | `DEFAULT 'sim'` | Status de ativação da conta |

- **Índices**: `idx_email`, `idx_role`, `idx_ativo`.

---

### 2.3. `alunos`
Dados cadastrais dos estudantes matriculados e vínculo com turmas e responsáveis.

| Coluna | Tipo | Modificadores | Descrição |
|---|---|---|---|
| `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único do estudante |
| `matricula` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | Código de matrícula institucional |
| `nome` | `VARCHAR(255)` | `NOT NULL` | Nome completo do aluno |
| `aniversario` | `DATE` | `NULL` | Data de nascimento |
| `turma_id` | `INT` | `NOT NULL` | FK para a turma (`turmas.id`) |
| `id_pai` | `INT` | `NULL` | FK para o responsável (`users.id`) |
| `faltas` | `INT` | `DEFAULT 0` | Contador consolidado de faltas |
| `status` | `ENUM('ativo', 'inativo', 'transferido', 'evadido')` | `DEFAULT 'ativo'` | Situação da matrícula |
| `data_criacao` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data de cadastro |
| `data_atualizacao`| `TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` | Última modificação |

- **Chaves Estrangeiras**:
  - `turma_id` ➔ `turmas(id)` com `ON DELETE RESTRICT ON UPDATE CASCADE`
  - `id_pai` ➔ `users(id)` com `ON DELETE SET NULL ON UPDATE CASCADE`
- **Índices**: `idx_matricula`, `idx_nome`, `idx_turma_id`, `idx_id_pai`, `idx_status`.

---

### 2.4. `presencas`
Tabela central de frequência diária escolar (utilizada pelo leitor QR Code e pelo diário de classe 1-Toque).

| Coluna | Tipo | Modificadores | Descrição |
|---|---|---|---|
| `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único do registro |
| `aluno_id` | `INT` | `NOT NULL` | FK do aluno (`alunos.id`) |
| `data` | `DATE` | `NOT NULL` | Data da presença (YYYY-MM-DD) |
| `presente` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | `1` = Presente, `0` = Falta |
| `registrado_por` | `INT` | `NOT NULL` | FK do usuário que lançou (`users.id`) |
| `data_registro` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp do momento exato do lançamento |

- **Restrição de Unicidade**: `UNIQUE (aluno_id, data)` — impede duplicidade no mesmo dia (retorna HTTP 409 em tentativas repetidas).
- **Chaves Estrangeiras**:
  - `aluno_id` ➔ `alunos(id)` com `ON DELETE CASCADE ON UPDATE CASCADE`
  - `registrado_por` ➔ `users(id)` com `ON DELETE RESTRICT ON UPDATE CASCADE`
- **Índices**: `idx_aluno_id`, `idx_data`, `idx_registrado_por`.

---

### 2.5. `posts`
Mural institucional de comunicados e recados pedagógicos.

| Coluna | Tipo | Modificadores | Descrição |
|---|---|---|---|
| `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único do comunicado |
| `titulo` | `VARCHAR(255)` | `NOT NULL` | Assunto do aviso |
| `conteudo` | `TEXT` | `NOT NULL` | Mensagem completa |
| `autor_id` | `INT` | `NOT NULL` | FK do autor (`users.id`) |
| `destinatario_id`| `INT` | `NULL` | FK opcional (`users.id`); `NULL` = aviso geral |
| `data_criacao` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data de publicação |
| `data_atualizacao`| `TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` | Última modificação |

- **Chaves Estrangeiras**:
  - `autor_id` ➔ `users(id)` com `ON DELETE RESTRICT ON UPDATE CASCADE`
  - `destinatario_id` ➔ `users(id)` com `ON DELETE SET NULL ON UPDATE CASCADE`
- **Índices**: `idx_autor_id`, `idx_destinatario_id`, `idx_data_criacao`.

---

## 3. Normalização (1FN, 2FN, 3FN)

1. **Primeira Forma Normal (1FN)**:
   - Todas as colunas contêm valores atômicos e indivisíveis.
   - Não há vetores ou atributos multivalorados em colunas únicas.
2. **Segunda Forma Normal (2FN)**:
   - A tabela `presencas` utiliza chave substituta (`id`) e mantém chave candidata única composta `(aluno_id, data)`.
   - Todos os atributos não-chave dependem inteiramente da chave primária.
3. **Terceira Forma Normal (3FN)**:
   - Informações cadastrais de responsáveis não são duplicadas em `alunos` (referenciadas estritamente via `id_pai`).
   - Nomes de autores de avisos e registradores de frequência são resolvidos via `JOIN`, evitando redundâncias transitivas.

---

## 4. Consultas Otimizadas do Backend

### Relatório de Frequência Consolidado (Analytics)
```sql
SELECT
  p.id,
  p.aluno_id,
  a.nome AS aluno_nome,
  a.matricula AS aluno_matricula,
  a.turma_id,
  t.nome AS turma_nome,
  p.data,
  p.presente,
  p.registrado_por,
  u.nome AS registrado_por_nome,
  p.data_registro
FROM presencas p
INNER JOIN alunos a ON a.id = p.aluno_id
LEFT JOIN turmas t ON t.id = a.turma_id
INNER JOIN users u ON u.id = p.registrado_por
WHERE p.data BETWEEN '2026-11-01' AND '2026-11-07'
ORDER BY p.data DESC, a.nome ASC;
```

---

<div align="center">
  <sub>Documentação Oficial do Banco de Dados • BipEscola</sub>
</div>
