<div align="center">
  <h1>🏫 BipEscola</h1>
  <p><strong>Sistema de Controle de Presença Escolar e Gestão Institucional</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="ExpressJS" />
    <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  </p>
  
  <p>Solução integrada de software para controle de fluxo de alunos, chamada diária, carteirinha digital QR Code e comunicação com responsáveis.</p>
</div>

---

## 📖 Sumário
- [🎯 Visão Geral](#-visão-geral)
- [💻 Stack Tecnológico](#-stack-tecnológico)
- [🔐 Controle de Acesso e Perfis (RBAC)](#-controle-de-acesso-e-perfis-rbac)
- [📱 Métodos de Frequência e Presença](#-métodos-de-frequência-e-presença)
- [🚀 Como Executar o Sistema](#-como-executar-o-sistema)
- [🧪 Testes Automatizados & Qualidade de Software](#-testes-automatizados--qualidade-de-software)
- [🏛️ Arquitetura do Sistema](#-arquitetura-do-sistema)
- [📂 Estrutura do Repositório](#-estrutura-do-repositório)
- [🔌 Referência Resumida de Endpoints](#-referência-resumida-de-endpoints)
- [🔑 Credenciais Padrão](#-credenciais-padrão)

---

## 🎯 Visão Geral

O **BipEscola** moderniza a gestão de presença e segurança em unidades escolares, atendendo desde a identificação rápida na portaria até o lançamento pedagógico do diário de classe.

### Principais Módulos:
1. **Controle de Presença Híbrido**: Registro via leitor óptico de QR Code na portaria ou chamada manual interativa (1-Toque) por turma.
2. **Carteirinha Digital**: Geração em tempo real de QR Code seguro para os alunos, acessível pelos pais e equipe escolar.
3. **Mural de Avisos Institucionais**: Envio de comunicados gerais para toda a escola ou direcionados a responsáveis específicos.
4. **Secretaria Acadêmica & Painel ADM**: Gerenciamento completo de contas de usuários, permissões, turmas e enturmação de alunos.
5. **Histórico & Frequência**: Acompanhamento analítico da assiduidade com filtros por período, turma e status.

---

## 💻 Stack Tecnológico

| Camada | Tecnologias Principais |
|---|---|
| **Backend** | Node.js (ESM), Express 5, MySQL 2 (`mysql2/promise`), JWT (`jsonwebtoken`), Bcrypt, Nodemailer |
| **Frontend Mobile** | React Native, Expo 58, React Navigation 7, Expo Camera, Expo Audio, react-native-qrcode-svg |
| **Qualidade & Testes** | Jest, Supertest, React Native Testing Library, Mocks ESM nativos |
| **Banco de Dados** | MySQL 8.0+ com tabelas normalizadas e integridade referencial estrita |

---

## 🔐 Controle de Acesso e Perfis (RBAC)

O sistema opera sob 4 perfis de permissão bem delimitados:

| Ação / Permissão | PARENT (Pais) | PORTEIRO | PROF (Professores) | ADM (Gestão) |
|---|:---:|:---:|:---:|:---:|
| Ver Carteirinha QR dos Filhos | ✅ | ❌ | ✅ | ✅ |
| Escanear QR Code na Portaria | ❌ | ✅ | ✅ | ✅ |
| Realizar Chamada Manual por Turma | ❌ | ❌ | ✅ | ✅ |
| Consultar Histórico e Frequência | Somente Filhos | ✅ | ✅ | ✅ |
| Publicar Comunicados no Mural | ❌ | ❌ | ✅ | ✅ |
| Gerenciar Usuários e Permissões | ❌ | ❌ | ❌ | ✅ |
| Gerenciar Turmas e Salas | ❌ | ❌ | ❌ | ✅ |
| Gerenciar e Matricular Alunos | ❌ | ❌ | ❌ | ✅ |

---

## 📱 Métodos de Frequência e Presença

1. **Leitura Óptica de QR Code (Modo Totem / Portaria)**:
   - O responsável ou aluno apresenta a carteirinha digital no app.
   - O porteiro ou coordenador utiliza a câmera no modo totem.
   - O código óptico padrão `aluno_<ID>` é decodificado instantaneamente com bipe sonoro de confirmação e persistido no banco via `POST /api/attendances`.
2. **Chamada Manual por Turma (Diário de Classe 1-Toque)**:
   - Professores selecionam a turma desejada e visualizam a listagem de estudantes matriculados.
   - Botões rápidos de **Presente (✓)** e **Falta (✕)** registram a assiduidade individual com retorno visual imediato.

---

## 🚀 Como Executar o Sistema

### Pré-requisitos
- **Node.js**: v18 ou superior
- **MySQL**: 8.0 ou superior instalado e em execução
- **Expo Go** (opcional, para testes no celular físico)

### 1. Inicializar o Banco de Dados
Abra o terminal MySQL e execute o script DDL:
```bash
mysql -u root -p < database/database.sql
```

### 2. Configurar e Iniciar o Backend
```bash
cd backend
npm install
```

Crie o arquivo `.env` dentro da pasta `backend`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=bipescola
JWT_SECRET=bipescola_jwt_secret_key_2026
NODE_ENV=development
RESET_TOKEN_LOG=true
```

Inicie o servidor:
```bash
npm start
```
O servidor estará acessível em: `http://localhost:3000`

### 3. Iniciar o Aplicativo Mobile (Expo)
Em um novo terminal:
```bash
cd mobile
npm install
npm start
```
- Pressione **`w`** para abrir no navegador web.
- Pressione **`a`** para abrir no emulador Android.
- Pressione **`i`** para abrir no simulador iOS.
- Ou escaneie o QR Code com o app **Expo Go** no smartphone conectado na mesma rede Wi-Fi.

> 💡 **Inicialização Rápida no Windows**: Você também pode executar o arquivo `iniciar.bat` na raiz do projeto para inicializar o backend e o mobile simultaneamente.

---

## 🧪 Testes Automatizados & Qualidade de Software

O ecossistema dispõe de testes unitários e de integração abrangendo regras de negócio, autorização RBAC, modelos relacionais e componentes visuais responsivos.

### Resultados da Suíte:
- **Backend**: **251 testes passando em 17 suítes** (> 96% de cobertura de código).
- **Mobile**: **17 testes passando em 5 suítes** (utilitários, layout adaptativo, sound player e APIs).

```bash
# Rodar testes do backend
cd backend
npm test

# Rodar testes com relatório de cobertura
npm run test:coverage

# Rodar testes do mobile
cd ../mobile
npm test
```

---

## 🏛️ Arquitetura do Sistema

O sistema é desenhado em camadas desacopladas (Controller ➔ Service ➔ Model ➔ Database), com documentação completa disponível em:
- 📘 [ARCHITECTURE.md](ARCHITECTURE.md): Diagramas de sequência Mermaid, arquitetura de resiliência e tratamento de exceções.
- 📄 [`docs/openapi.json`](docs/openapi.json): Especificação formal OpenAPI 3.0 de todos os endpoints REST.
- 🔑 [credenciais.md](credenciais.md): Lista completa de usuários padrão de testes e demonstração.

---

## 📂 Estrutura do Repositório

```text
bipescola/
├── backend/                  # Servidor API RESTful Node.js + Express
│   ├── src/
│   │   ├── controllers/      # Controladores HTTP (validação e status)
│   │   ├── services/         # Regras de negócio, hashing e auth
│   │   ├── models/           # Abstração de queries SQL parametrizadas
│   │   ├── routes/           # Mapeamento de rotas e middlewares RBAC
│   │   ├── middlewares/      # authMiddleware (JWT) e roleMiddleware
│   │   └── database/         # Pool de conexões MySQL 2
│   ├── tests/                # Testes unitários e de integração (Jest)
│   ├── app.js                # Configuração do Express, CORS e erros globais
│   └── server.js             # Inicialização do servidor HTTP e verificação de ping
├── mobile/                   # Aplicativo React Native & Expo
│   ├── src/
│   │   ├── app/              # Ponto de entrada, fontes e navegação mestre
│   │   ├── pages/            # Módulos: Admin, Presença, Frequência, Avisos, Perfil
│   │   └── shared/           # API clients, design tokens, hooks responsivos, sons
│   └── package.json
├── database/
│   └── database.sql          # Script DDL com constraints, FKs e dados iniciais
├── docs/                     # Documentação de banco, presença e OpenAPI 3.0
├── credenciais.md            # Guia de credenciais padrão para testes
├── ARCHITECTURE.md           # Guia arquitetural completo e relatório de QA
└── README.md
```

---

## 🔌 Referência Resumida de Endpoints

### Autenticação & Usuários
- `POST /api/users/login` - Autenticação por e-mail e senha (retorna JWT e perfil)
- `GET /api/users` - Listagem de usuários (restrito a ADM)
- `POST /api/users` - Cadastro de usuário com senha temporária
- `PUT /api/users/:id` - Atualização cadastral
- `DELETE /api/users/:id` - Exclusão de usuário (protegido contra auto-exclusão do ADM)
- `PUT /api/users/change-password` - Alteração da própria senha
- `POST /api/users/forgot-password` / `POST /api/users/reset-password` - Recuperação de senha

### Turmas
- `GET /api/class` (aliases `/api/classes`, `/api/turmas`) - Listagem de turmas ativas/inativas
- `POST /api/class` - Criação de nova turma (ADM)
- `PUT /api/class/:id` - Edição de turma (ADM)
- `DELETE /api/class/:id` - Exclusão de turma (impede exclusão se houver alunos vinculados)

### Alunos
- `GET /api/students` - Listagem completa de alunos
- `GET /api/students/turma/:id` - Alunos de uma turma específica
- `GET /api/students/pai/:id` - Filhos vinculados a um responsável
- `POST /api/students` - Matrícula de aluno (ADM)
- `PUT /api/students/:id` - Edição de matrícula e status (ADM)
- `DELETE /api/students/:id` - Exclusão de aluno (ADM)

### Presenças & Frequência
- `POST /api/attendances` - Registro de presença (QR Code ou chamada)
- `GET /api/attendances/historico` - Relatório com métricas e taxa de comparecimento
- `GET /api/attendances/aluno/:id` - Histórico individual do estudante
- `PUT /api/attendances/:id` - Correção de lançamento (ADM, PROF)
- `DELETE /api/attendances/:id` - Exclusão de lançamento (ADM)

### Mural de Avisos
- `GET /api/posts` - Lista avisos (pais veem apenas comunicados gerais ou direcionados)
- `POST /api/posts` - Publicação de comunicado geral ou individual (ADM, PROF)
- `PUT /api/posts/:id` / `DELETE /api/posts/:id` - Edição ou remoção de aviso

---

## 🔑 Credenciais Padrão

Para testes imediatos após executar o `database/database.sql`:

| Role | E-mail | Senha |
|---|---|---|
| **ADM** | `admin@emei.com` | `admin123` |
| **PROF** | `prof@emei.com` | `prof123` |
| **PORTEIRO** | `porteiro@emei.com` | `portaria123` |
| **PARENT** | `pai@email.com` | `123456` |

Para mais detalhes e cenários adicionais com turmas e alunos semeados, consulte [credenciais.md](credenciais.md).

---

<div align="center">
  <sub>BipEscola • Licença ISC • Confiabilidade, Segurança e Frequência Escolar</sub>
</div>
