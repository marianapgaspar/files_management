# Projeto Fullstack - Sistema de Gerenciamento de Arquivos

Este projeto é uma aplicação fullstack desenvolvida para proporcionar uma experiência de gerenciamento de estruturas de diretórios e arquivos, de forma visualmente similar ao Google Drive. A aplicação é construída utilizando as seguintes tecnologias:

## Backend REST
- Node
- Typescript
- Express
- Docker
- Banco de dados Postgres

## Frontend
- Typescript
- React
- ViteJS

## Requisitos da Aplicação

A aplicação atende aos seguintes requisitos:

1. **Interface de Usuário:**
   - Visualmente similar ao Google Drive.
   - Interação com estruturas de diretórios e arquivos.

2. **Autenticação de Usuários:**
   - Utiliza JWT para comunicação entre frontend e backend.
   - Emprega cookies para gerenciar a autenticação.

3. **Permissionamento:**
   - **Administrador:** Acesso de leitura, escrita, deleção e compartilhamento sobre todos os arquivos e diretórios.
   - **Criador:** Acesso de leitura, escrita, deleção e compartilhamento sobre todos os objetos criados por ele.
   - **Convidado:** Acessos de acordo com as permissões concedidas pelos perfis acima (leitura, escrita e deleção).

4. **Recursividade nos Diretórios:**
   - Diversos níveis de recursividade nos diretórios.
   - Permissões podem contemplar ou impedir a recursividade.

5. **Gerenciamento de Usuários e Permissões:**
   - Criação de usuários.
   - Configuração de permissões para usuários existentes e novos.

6. **Criação de Diretórios e Arquivos:**
   - Permite criar diretórios e arquivos dentro da estrutura, associando corretamente na base de dados.

7. **Massa de Dados para Testes:**
   - Scripts/seeds disponíveis com massa de dados para testes iniciais.

## Configuração e Execução

1. **Projeto:**
   - Após fazer o clone do repositório, execute o comando na raís do projeto `docker-compose up -d`

2. **Banco de dados:**
   - Para criar as tabelas digite no terminal `docker exec files_menagement_api_1 npm run migrate`
   - Para criar os dados iniciais digite no terminal `docker exec files_menagement_api_1 npm run seed`

4. **Testes Iniciais:**
   - Com a população automática do script, foram criados os seguintes usuários: Mariana como administradora e senha "teste"; Carol como criadora e senha "teste"; Aline como convidada e senha "Teste";
   - É possível entrar com os três usuários porém cada um poderá utilizar o projeto conforme suas permissões
  
## Estrutura de Diretórios
O projeto foi desenvolvido com dois servidores diferentes, um para o backend, do qual fornece as APIs para acesso ao banco de dados, e outro para o frontend.
   - Na pasta backend foram criados os arquivos db.js para acessar o banco de dados e o arquivo app.js onde é feita a autenticação com frontend e a criação das APIs que conectam com o banco. Também foram criadas duas pastas auxiliares, uma de uploads que irá armazenar os arquivos de upload, e por fim a pasta scripts onde contém os arquivos para migração e população automática do banco de dados.
   - Na pasta frontend foram criadas duas pastas para separar as páginas principais e os componentes de auxilio para as páginas. Também foi criada o App.tsx que serve de arquivo inicial e por fim a PrivateRoutes.tsx que administra a privacidade de cada página conforme o usuário.

```plaintext
project-root/
│
├── backend/
│   ├── uploads/
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── seeds.js
│   ├── uploads/
│   ├── app.js
│   ├── db.js
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── PrivateRoutes.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── vite.config.ts
└── docker-compose.yml
```

## Contribuição e Melhorias

Contribuições são bem-vindas! Sinta-se à vontade para sugerir melhorias, relatar problemas ou enviar pull requests.
