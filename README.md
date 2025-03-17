# Trabalho Final da Disciplina de Engenharia de Software II

## Projeto PID e RID - Sistema de Cadastro para Docentes

Este sistema foi desenvolvido para facilitar o cadastro e a gestão do  **Plano Individual Docente (PID)** e **Relatório Individual de Docente (RID)**. Ele oferece uma interface simples para o gerenciamento das atividades acadêmicas, com funcionalidades de cadastro, edição e exclusão de registros.

## Funcionalidades

- **Cadastro de PID e RID**: Permite que os docentes registrem suas atividades acadêmicas de forma detalhada.
- **Edição de Registros**: O docente pode editar as informações de suas atividades.
- **Exclusão de Registros**: Permite a exclusão de PID e RID.
- **Visualização**: O docente pode visualizar todos os seus PIDs e RIDs cadastrados.

## Tecnologias Utilizadas

- **Node.js**: Para backend e lógica do servidor.
- **Express.js**: Framework para criação de APIs e gerenciamento das rotas.
- **MongoDB**: Banco de dados NoSQL para armazenar informações dos PIDs e RIDs.
- **Bootstrap**: Framework CSS para criação da interface do usuário.
- **Handlebars**: Template engine para renderizar páginas HTML dinâmicas.

## Passo a Passo de Instalação

Para rodar o projeto em sua máquina local, siga os passos abaixo:

### 1. Clone o repositório

```bash
git clone https://github.com/knuppl/edsii.git
```

### 2. Acesse o diretório do projeto

```bash
cd projeto-pid-rid
```

### 3. Instale as dependências
Utilize o npm para instalar as dependências necessárias:

```bash
npm install
```

### 4. Inicie o servidor

```bash
npm start
```
O servidor estará disponível em http://localhost:3000.

## Testes Unitários
O projeto vem com testes unitários para garantir que o código esteja funcionando corretamente. Existem dois tipos de testes disponíveis:

### 1. Teste por Classe

Para executr os testes por classe específica, passando o nome da classe, utilize o seguinte comando:

```bash
npm run test:unit <nome-da-classe>
```

Substitua <nome-da-classe> pelo nome da classe que você deseja testar. Por exemplo, para testar a classe CadastroPid, você rodaria o comando:

```bash
npm run test:unit CadastroPid
```

### 2. Teste Completo com Coverage
Para executar todos os testes e obter o coverage (cobertura de testes), utilize o seguinte comando:

```bash
npm run test:coverage
```
Este comando irá rodar todos os testes e gerar um relatório de cobertura, que mostrará a porcentagem de código coberto pelos testes.

## Contato
André Knupp - andreklacerda@proton.me
Gustavo Júlio - gustavo-julio@live.com








