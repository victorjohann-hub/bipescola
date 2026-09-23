# BANCO DE DADOS - BIPESCOLA

## Normalizado (1FN, 2FN, 3FN)

---

## 1. ESTRUTURA DO BANCO DE DADOS

### Tabelas

O banco de dados possui 5 tabelas principais:

1. TURMAS - Armazena as turmas da escola
2. USERS - Armazena usuarios do sistema (PROF, ADM, PARENT)
3. ALUNOS - Armazena dados dos alunos
4. QR_CODES - Vincula QR Codes aos alunos
5. REGISTROS_MOVIMENTACAO - Registra entrada e saida

---

## 2. NORMALIZACAO (1FN, 2FN, 3FN)

### Primeira Forma Normal (1FN)
Toda coluna contem valores atomicos (indivisivel). Nao ha campos multivalorados.

Exemplo correto:
- nome: "Joao Silva Santos" (um valor)
- matricula: "MAT001" (um valor)

Nao ha repeticoes:
- CPF removido (nao necessario)
- Email unico por usuario

### Segunda Forma Normal (2FN)
Todos os atributos nao-chave dependem totalmente da chave primaria.

Relacao ALUNOS:
- id (chave primaria)
- matricula, nome, aniversario - dependem de id
- turma_id, id_pai - referencias externas (chaves estrangeiras)

Relacao REGISTROS_MOVIMENTACAO:
- id (chave primaria)
- aluno_id, turma_id - referencias externas
- tipo_movimentacao, data_hora - dependem de id

### Terceira Forma Normal (3FN)
Nenhum atributo nao-chave depende de outro atributo nao-chave.

Exemplo: Nao armazenamos o nome do pai dentro de ALUNOS
- id_pai referencia users (nao duplicamos nome do pai)
- Dessa forma, se o pai mudar de nome, atualizamos apenas em users

---

## 3. TABELAS DETALHADAS

### TURMAS
```
id (INT - PK)
nome (VARCHAR 100) - UNIQUE
  Exemplos: "1º Ano A", "1º Ano B", "2º Ano A"
data_criacao (TIMESTAMP)
status (ENUM: ativa, inativa)

Indice: idx_nome
Relacionamento: 1:N com ALUNOS
```

Normalizacao:
- Nome unico garante identidade
- Sem repeticoes ou dados redundantes
- Serie ja esta embutida no nome (ex: "1º Ano A")
- Sem descricao adicional desnecessaria

---

### USERS
```
id (INT - PK)
email (VARCHAR 100) - UNIQUE
senha (VARCHAR 255)
nome (VARCHAR 255)
aniversario (DATE)
role (ENUM: PROF, ADM, PARENT)
firstLogin (BOOLEAN)
data_criacao (TIMESTAMP)
data_atualizacao (TIMESTAMP)
ativo (ENUM: sim, nao)

Indices: idx_email, idx_role, idx_ativo
Relacionamento: 1:N com ALUNOS (via id_pai)
```

Normalizacao:
- Email unico garante identidade
- Nao ha dados redundantes
- Sem campos desnecessarios (removido escola_id - unica escola)
- Cada usuario eh independente

---

### ALUNOS
```
id (INT - PK)
matricula (VARCHAR 50) - UNIQUE
nome (VARCHAR 255)
aniversario (DATE)
turma_id (INT - FK)
id_pai (INT - FK) - pode ser NULL
faltas (INT)
data_criacao (TIMESTAMP)
data_atualizacao (TIMESTAMP)
status (ENUM: ativo, inativo, transferido, evadido)

Indices: idx_matricula, idx_nome, idx_turma_id, idx_id_pai, idx_status
Relacoes:
  FOREIGN KEY turma_id -> TURMAS.id
  FOREIGN KEY id_pai -> USERS.id
```

Normalizacao:
- id como chave primaria (INT)
- matricula UNIQUE para identificacao alternativa
- Nao ha cpf (nao necessario)
- Dados do responsavel sao referenciados via id_pai (nao duplicados)
- Sem dados redundantes

---

### QR_CODES
```
id (INT - PK)
aluno_id (INT - FK)
codigo_qr (VARCHAR 255) - UNIQUE
data_criacao (TIMESTAMP)
data_atualizacao (TIMESTAMP)
ativo (ENUM: sim, nao)

Indices: idx_codigo_qr, idx_aluno_id, idx_ativo
Relacao:
  FOREIGN KEY aluno_id -> ALUNOS.id (ON DELETE CASCADE)
```

Normalizacao:
- Cada QR Code eh identificado por codigo_qr UNIQUE
- Referencia ALUNOS via aluno_id
- Sem informacoes duplicadas
- Quando um aluno eh deletado, QR Code tambem eh (CASCADE)

---

### REGISTROS_MOVIMENTACAO
```
id (INT - PK)
aluno_id (INT - FK)
turma_id (INT - FK)
tipo_movimentacao (ENUM: entrada, saida)
data_registro (DATE)
hora_registro (TIME)
data_hora_completa (DATETIME)
data_criacao (TIMESTAMP)
observacoes (VARCHAR 255)

Indices: idx_aluno_id, idx_turma_id, idx_data_registro, idx_tipo_movimentacao,
          idx_data_hora_completa, idx_aluno_data

Relacoes:
  FOREIGN KEY aluno_id -> ALUNOS.id
  FOREIGN KEY turma_id -> TURMAS.id
```

Normalizacao:
- id como chave primaria
- Cada movimento eh um registro separado (1FN)
- Nao armazenamos dados do aluno (referenciam via aluno_id)
- Nao armazenamos escola (herda via turma)
- Sem redundancia

---

## 4. DIAGRAMA DE RELACIONAMENTOS

```
USERS (1)
  |
  |-- id (referencia id_pai em ALUNOS)
  |
  +-> Pode ter N filhos em ALUNOS
  

TURMAS (1)
  |
  |-- id (referencia turma_id em ALUNOS)
  |
  +-> Pode ter N alunos


ALUNOS (1)
  |
  |-- id (referencia aluno_id em QR_CODES)
  |-- id (referencia aluno_id em REGISTROS_MOVIMENTACAO)
  |
  +-> Tem 1 QR Code ativo
  +-> Tem N Registros de Movimentacao


QR_CODES (N:1)
  |
  +-> Referencia 1 ALUNO


REGISTROS_MOVIMENTACAO (N:1)
  |
  +-> Referencia 1 ALUNO
  +-> Referencia 1 TURMA
```

---

## 5. INTEGRIDADE REFERENCIAL

### Chaves Estrangeiras

ALUNOS.turma_id -> TURMAS.id
  - ON DELETE RESTRICT (nao permite deletar turma com alunos)
  - ON UPDATE CASCADE (atualiza automaticamente)

ALUNOS.id_pai -> USERS.id
  - ON DELETE SET NULL (deixa NULL se pai eh deletado)
  - ON UPDATE CASCADE (atualiza se id_pai mudar)

QR_CODES.aluno_id -> ALUNOS.id
  - ON DELETE CASCADE (deleta QR Code se aluno eh deletado)
  - ON UPDATE CASCADE

REGISTROS_MOVIMENTACAO.aluno_id -> ALUNOS.id
  - ON DELETE RESTRICT (nao permite deletar aluno com movimentos)
  - ON UPDATE CASCADE

REGISTROS_MOVIMENTACAO.turma_id -> TURMAS.id
  - ON DELETE RESTRICT (nao permite deletar turma com movimentos)
  - ON UPDATE CASCADE

---

## 6. DADOS DE EXEMPLO

### TURMAS
```
id | nome
1  | 1º Ano A
2  | 1º Ano B
3  | 2º Ano A
```

### USERS
```
id | email            | role   | nome
1  | pai@email.com    | PARENT | Maria Silva Santos
2  | prof@emei.com    | PROF   | Professora Escola
3  | admin@emei.com   | ADM    | Coordenadora Escola
```

### ALUNOS
```
id | matricula | nome                | turma_id | id_pai
1  | MAT001    | Joao Silva Santos   | 1        | 1
2  | MAT002    | Ana Paula Costa     | 1        | 1
3  | MAT003    | Pedro Oliveira      | 2        | NULL
4  | MAT004    | Lucia Ferreira      | 2        | NULL
5  | MAT005    | Bruno Martins       | 3        | NULL
6  | MAT006    | Gabriela Rocha      | 3        | NULL
```

---

## 7. OPERACOES PRINCIPAIS

### Registrar Entrada
```sql
INSERT INTO registros_movimentacao 
(aluno_id, turma_id, tipo_movimentacao, data_registro, hora_registro, data_hora_completa)
SELECT a.id, a.turma_id, 'entrada', CURDATE(), CURTIME(), NOW()
FROM alunos a
WHERE a.matricula = 'MAT001' AND a.status = 'ativo';
```

### Ver Dados do Aluno e Seu Pai
```sql
SELECT
    a.matricula,
    a.nome,
    t.nome AS turma,
    u.nome AS pai_nome,
    u.email AS pai_email
FROM alunos a
JOIN turmas t ON a.turma_id = t.id
LEFT JOIN users u ON a.id_pai = u.id
WHERE a.matricula = 'MAT001';
```

### Consultar Historico
```sql
SELECT
    a.nome,
    rm.tipo_movimentacao,
    rm.data_hora_completa
FROM registros_movimentacao rm
JOIN alunos a ON rm.aluno_id = a.id
WHERE a.matricula = 'MAT001'
ORDER BY rm.data_hora_completa DESC;
```

---

## 8. VANTAGENS DA ESTRUTURA NORMALIZADA

1. Sem Redundancia
   - Dados dos pais sao armazenados 1 vez em USERS
   - Alunos referenciam via id_pai
   - Atualizacoes sao simples (mudam 1 lugar)

2. Integridade de Dados
   - Chaves estrangeiras garantem consistencia
   - RESTRICT evita deletar dados necessarios
   - CASCADE garante sincronizacao

3. Eficiencia
   - Indices otimizam buscas (matricula, nome, turma, data)
   - Queries sao diretas
   - Sem dados duplicados

4. Escalabilidade
   - Estrutura suporta crescimento
   - Facil adicionar novas turmas, alunos, usuarios
   - Relacoes claras entre tabelas

5. Manutencao
   - Campos bem definidos
   - Sem ambiguidades
   - Facil entender a estrutura

---

## 9. CAMPOS REMOVIDOS E MOTIVO

### Escolas
Removido: Tabela inteira nao eh necessaria
Motivo: Sistema serve apenas 1 escola (EMEI Manoel Eugencio Nascimento)
Impacto: Simplifica banco, removes joins desnecessarios

### Turma - Serie
Removido: Campo serie
Motivo: Serie ja esta no nome da turma (ex: "1º Ano A")
Impacto: Evita redundancia, 1 fonte de verdade

### Turma - Descricao
Removido: Campo descricao
Motivo: Nao eh necessario para funcionamento
Impacto: Simplifica modelo

### Alunos - CPF
Removido: Campo cpf
Motivo: Nao eh necessario para controle de presenca
Impacto: Menos dados armazenados

### Alunos - Responsavel (nome, email, telefone)
Removido: Campos desnecessarios
Motivo: Responsavel eh um usuario (PARENT) com seus proprios dados
Impacto: Evita redundancia, dados sempre sincronizados via id_pai

### Users - escola_id
Removido: Campo escola_id
Motivo: Unica escola no sistema
Impacto: Simplifica, nao precisa validar escola

---

## 10. CHECKLIST DE NORMALIZACAO

Primeira Forma Normal (1FN):
  Todos os valores sao atomicos                         [ OK ]
  Nao ha campos multivalorados                          [ OK ]
  Nao ha grupos repetitivos                             [ OK ]

Segunda Forma Normal (2FN):
  Esta em 1FN                                           [ OK ]
  Todos atributos nao-chave dependem da chave primaria  [ OK ]
  Sem dependencias parciais                             [ OK ]

Terceira Forma Normal (3FN):
  Esta em 2FN                                           [ OK ]
  Sem dependencias transitivas                          [ OK ]
  Atributos nao-chave nao dependem uns dos outros       [ OK ]

---

## 11. COMO USAR

### Executar Script
```
mysql -u root -p < database.sql
```

### Verificar Estrutura
```
DESCRIBE alunos;
SHOW KEYS FROM alunos;
```

### Inserir Dados
Exemplo: Ver inserts no arquivo database.sql

### Fazer Consultas
Exemplos: Ver consultasUteis no database.sql

---

**Banco de Dados Normalizado e Pronto para Uso**
