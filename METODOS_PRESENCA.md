# Dois Métodos de Registro de Presença - BipEscola

Comparação entre QR Code e Confirmação Manual.

---

## RESUMO COMPARATIVO

| Aspecto | QR Code | Confirmacao Manual |
|---------|-----------|---------------------|
| Velocidade | Muito rápida (~1s) | Rápida (~10s) |
| Casos de Uso | Entrada/Saída realtime | Consolidação em lote |
| Precisão | Automática | Seleção manual |
| Equipamento | Precisa leitor QR | Só precisa app/web |
| Para Pais | Ideal para seus filhos | Também funciona |
| Para Admin | Bom para pontuais | Ótimo para lotes |
| Erros | QR danificado | Marcação errada |

---

## METODO 1: QR CODE

### Fluxo Visual

```
┌─────────────────────────────────┐
│      TELA DE QR CODE            │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │   📷 Câmera Ativa      │   │
│   │                         │   │
│   │   ┌─────────────┐       │   │
│   │   │  [QR Code]  │       │   │
│   │   └─────────────┘       │   │
│   └─────────────────────────┘   │
│                                 │
│   Aproxime o código...          │
│                                 │
│   [ Cancelar ]  [ Manual ]      │
└─────────────────────────────────┘
        ↓ (QR Lido)
┌─────────────────────────────────┐
│     CONFIRMAÇÃO SUCESSO         │
├─────────────────────────────────┤
│                                 │
│   ✅ Entrada Registrada!        │
│                                 │
│   João Silva Santos             │
│   Matrícula: MAT001             │
│   Turma: Turma A                │
│   Hora: 07:30:45                │
│                                 │
│   [ Próximo ]                   │
└─────────────────────────────────┘
```

### API

```javascript
// Fluxo no Backend
POST /api/movimentacoes/qrcode

// 1. Decodificar QR Code
codigo_qr = decodificar("QR_001_MAT001")

// 2. Extrair matrícula
matricula = extrair_matricula(codigo_qr)  // "MAT001"

// 3. Buscar aluno
aluno = SELECT * FROM alunos WHERE matricula = matricula

// 4. Validar permissão do usuário
if user.role == 'admin' || user_has_child(user.id, aluno.id):
    valido = true

// 5. Validar aluno
if aluno.status != 'ativo':
    erro = "Aluno inativo"

// 6. Registrar
INSERT INTO registros_movimentacao (
    aluno_id, matricula, escola_id, turma_id,
    tipo_movimentacao, data_registro, hora_registro, data_hora_completa
) VALUES (aluno.id, aluno.matricula, aluno.escola_id, aluno.turma_id,
          'entrada', CURDATE(), CURTIME(), NOW())

// 7. Retornar confirmação
return {
    aluno: aluno.nome_completo,
    tipo: 'entrada',
    hora: NOW()
}
```

### Vantagens

- Muito rápida (1-2 segundos)
- Automática (sem risco de erro humano)
- Ideal para entrada/saída contínua
- Rastreável por QR Code
- Funciona para pais acompanharem filhos
- Coordenação pode usar em pontos críticos

### Desvantagens

- Precisa de leitor QR (câmera + software)
- QR danificado = não funciona
- Requer tecnologia (smartphone/tablet)
- Conexão internet necessária

### Quando Usar

- Entrada diária (07:30)
- Saída almoço (11:30)
- Retorno almoço (12:30)
- Saída final (17:00)
- Pais confirmando filhos
- Situações pontuais

---

## METODO 2: CONFIRMACAO MANUAL

### Fluxo Visual

```
┌──────────────────────────────────┐
│   LISTA DE ALUNOS - PRESENÇA     │
├──────────────────────────────────┤
│                                  │
│  Turma A - INFANTIL I            │
│  ☐ João Silva Santos (MAT001)    │
│  ☐ Ana Paula Costa (MAT002)      │
│                                  │
│  Turma B - INFANTIL I            │
│  ☐ Pedro Oliveira (MAT003)       │
│  ☐ Lucia Ferreira (MAT004)       │
│                                  │
│  Turma C - INFANTIL II           │
│  ☐ Bruno Martins (MAT005)        │
│  ☐ Gabriela Rocha (MAT006)       │
│                                  │
│  Tipo: [ Entrada ▼ ]             │
│                                  │
│  [ Cancelar ]  [ Confirmar ]     │
└──────────────────────────────────┘
        ↓ (Seleciona + Confirma)
┌──────────────────────────────────┐
│   CONFIRMAÇÃO SUCESSO            │
├──────────────────────────────────┤
│                                  │
│  ✅ Presença Registrada!         │
│                                  │
│  3 alunos confirmados            │
│                                  │
│  • João Silva Santos             │
│  • Ana Paula Costa               │
│  • Pedro Oliveira                │
│                                  │
│  Hora: 07:35                     │
│                                  │
│  [ Voltar ]  [ Nova Rodada ]     │
└──────────────────────────────────┘
```

### API

```javascript
// Fluxo no Backend
POST /api/movimentacoes/confirmacao

// Input
{
  usuario_id: 2,
  aluno_ids: [1, 2, 3],
  tipo_movimentacao: 'entrada'
}

// 1. Validar permissões para cada aluno
for (aluno_id of aluno_ids):
    if user.role == 'pai':
        if !user_has_child(user.id, aluno_id):
            erro = "Não autorizado"
    
    // Validar aluno
    aluno = SELECT * FROM alunos WHERE id = aluno_id
    if aluno.status != 'ativo':
        erro = "Aluno inativo"

// 2. Inserir registros para todos
for (aluno_id of aluno_ids):
    INSERT INTO registros_movimentacao (
        aluno_id, matricula, escola_id, turma_id,
        tipo_movimentacao, data_registro, hora_registro, data_hora_completa
    ) VALUES (aluno_id, aluno.matricula, aluno.escola_id, 
              aluno.turma_id, 'entrada', CURDATE(), 
              CURTIME(), NOW())

// 3. Retornar confirmação
return {
    total: 3,
    registros: [
        { aluno: "João", matricula: "MAT001" },
        { aluno: "Ana", matricula: "MAT002" },
        { aluno: "Pedro", matricula: "MAT003" }
    ]
}
```

### Vantagens

- Simples de usar (todo mundo sabe clicar)
- Ideal para registros em lote
- Registra múltiplos alunos de uma vez
- Consolidação ao final do turno
- Funciona em qualquer dispositivo (web/app)
- Pais podem marcar seus filhos
- Seguro (não precisa de QR físico)

### Desvantagens

- Mais lenta (10-30 segundos)
- Risco de erro humano (marcar errado)
- Requer atenção do usuário
- Não rastreia hora exata individual
- Fácil esquecer de marcar alguém

### Quando Usar

- Consolidação ao final do turno
- Presença diária por turma
- Corrigir registros perdidos
- Pais acompanhando filhos
- Relatórios administrativos
- Não há urgência de horário exato

---

## QUAL USAR EM CADA SITUACAO

### Para PAIS

Scenario 1: Pai deixa filho na escola
- Opcao 1 (QR Code): Excelente
  - Pai escaneia QR Code do filho
  - Confirmação instantânea
  - Pode ir embora sabendo que foi registrado

- Opcao 2 (Manual): Bom
  - Pai marca filho na lista
  - Depois clica confirmar
  - Pode esquecer se fizer depois

Scenario 2: Pai consultando se filho chegou
- Opcao 1 (QR Code): Muito bom
  - Pai vê histórico do filho
  - Vê hora exata de entrada

- Opcao 2 (Manual): Fraco
  - Manual não é para consulta, é para registrar

---

### Para ADMIN/COORDENACAO

Scenario 1: Abertura da escola (07:30)
- Opcao 1 (QR Code): Bom
  - Vai sendo registrado conforme chegam
  - Mais trabalhoso (um por um)

- Opcao 2 (Manual): Excelente
  - Registra todos de uma vez no fim do turno
  - Mais rápido e prático

Scenario 2: Aluno chega tarde
- Opcao 1 (QR Code): Excelente
  - Escaneia QR quando chegar
  - Registra hora real de entrada

- Opcao 2 (Manual): Fraco
  - Pode esquecer se for depois

Scenario 3: Saída para almoço (11:30)
- Opcao 1 (QR Code): Muito bom
  - Escaneia QR quando saem
  - Registro automático

- Opcao 2 (Manual): Fraco
  - Requer memória de quem saiu

Scenario 4: Relatório de presença do dia
- Opcao 1 (QR Code): Excelente
  - Tudo já está registrado
  - Relatório completo e automático

- Opcao 2 (Manual): Bom
  - Só cria registros quando confirma
  - Perfeito para consolidação

---

## ESTRATEGIA RECOMENDADA

### Fluxo Ideal do Dia

```
07:30 - ABERTURA
├─ OPÇÃO 1 (QR Code): Admin em porta escaneia cada criança
│  └─ Entrada individual, hora automática
├─ OU OPÇÃO 2 (Manual): Admin consolida lista depois
│  └─ Mais rápido se usar junto

11:30 - SAÍDA ALMOÇO
├─ OPÇÃO 1 (QR Code): Cada saída escaneia
└─ Mais preciso para rastrear saída

12:30 - RETORNO ALMOÇO
├─ OPÇÃO 1 (QR Code): Cada retorno escaneia
└─ Mais preciso para rastrear retorno

17:00 - SAÍDA FINAL
├─ OPÇÃO 1 (QR Code): Escaneia quando saem
├─ OU OPÇÃO 2 (Manual): Consolida quem saiu
└─ Pode usar as duas

17:30 - RELATÓRIO DO DIA
├─ Sistema mostra tudo consolidado
└─ Admin gera relatório
```

---

## ENDPOINTS NECESSARIOS

### QR Code
```
POST /api/movimentacoes/qrcode
  - codigo_qr (string)
  - usuario_id (int)
  - tipo (entrada|saida)

Response:
  - aluno (nome, matricula, turma)
  - tipo (entrada|saida)
  - hora (timestamp)
```

### Confirmação Manual
```
POST /api/movimentacoes/confirmacao
  - usuario_id (int)
  - aluno_ids (array)
  - tipo_movimentacao (entrada|saida)

Response:
  - total (int)
  - registros (array)
```

### Consultar Alunos (Para Confirmação Manual)
```
GET /api/meus-alunos (se pai)
GET /api/alunos (se admin)

Response:
  - id
  - matricula
  - nome_completo
  - turma
```

### Histórico
```
GET /api/movimentacoes/historico/:matricula

Response:
  - aluno (nome)
  - registros (array de entradas/saídas com horário)
```

---

## CHECKLIST PARA O BACKEND

### QR Code
- [ ] Decodificar código QR
- [ ] Extrair matrícula
- [ ] Validar aluno existe
- [ ] Validar aluno está ativo
- [ ] Validar permissão do usuário
- [ ] Registrar com data/hora automática
- [ ] Retornar confirmação com nome + turma

### Confirmação Manual
- [ ] Receber lista de alunos selecionados
- [ ] Validar permissão para cada aluno
- [ ] Validar alunos estão ativos
- [ ] Inserir registros em lote
- [ ] Retornar confirmação com total
- [ ] Mostrar alunos registrados

### Comum
- [ ] Validar usuario está logado
- [ ] Validar tipo_movimentacao (entrada/saida)
- [ ] Registrar apenas datas de hoje
- [ ] Usar data/hora automática (NOW())
- [ ] Nunca permitir editar/deletar registros

---

## EXEMPLOS DE RESPOSTA

### QR Code - Sucesso
```json
{
  "sucesso": true,
  "mensagem": "Entrada registrada com sucesso",
  "aluno": {
    "matricula": "MAT001",
    "nome_completo": "João Silva Santos",
    "turma": "Turma A"
  },
  "tipo": "entrada",
  "hora": "07:30:45",
  "timestamp": "2024-09-06T07:30:45.000Z"
}
```

### QR Code - Erro
```json
{
  "sucesso": false,
  "erro": "QR Code inválido ou aluno não encontrado"
}
```

### Confirmação Manual - Sucesso
```json
{
  "sucesso": true,
  "mensagem": "Presença de 3 alunos registrada com sucesso",
  "total": 3,
  "registros": [
    {
      "aluno_id": 1,
      "matricula": "MAT001",
      "nome_completo": "João Silva Santos",
      "tipo": "entrada",
      "hora": "07:35:00"
    },
    {
      "aluno_id": 2,
      "matricula": "MAT002",
      "nome_completo": "Ana Paula Costa",
      "tipo": "entrada",
      "hora": "07:35:00"
    },
    {
      "aluno_id": 3,
      "matricula": "MAT003",
      "nome_completo": "Pedro Oliveira",
      "tipo": "entrada",
      "hora": "07:35:00"
    }
  ]
}
```

### Confirmação Manual - Erro
```json
{
  "sucesso": false,
  "erro": "Nenhum aluno selecionado"
}
```

---

Pronto para implementar!
