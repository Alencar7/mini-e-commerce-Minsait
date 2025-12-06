<!-- # ECommerce

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page. -->

# Mini E-Commerce – Capacitação Minsait

Frontend em **Angular 18** para um **Mini E-Commerce** que consome uma API Java de produtos e gerencia um **carrinho de compras** com persistência em `localStorage`.

**Projeto desenvolvido como trabalho final da Capacitação Minsait – Dezembro/2025**

---

## Objetivo da aplicação

Este projeto foi desenvolvido como **trabalho final da Capacitação Minsait**, com os seguintes objetivos:

1. Consumir uma **API REST de produtos** (Java/Spring Boot)
2. Implementar **CRUD completo** de produtos no frontend
3. Gerenciar um **carrinho de compras** reativo com:
   - Adição de itens a partir da listagem
   - Atualização automática de total
   - Persistência via `localStorage`
   - Contador de itens no header

**Critérios de Avaliação:**

- Código limpo e organizado
- Commits amigáveis e frequentes
- Uso de Reactive Forms com validações
- Services bem separados (ProductService, CartService)
- Componentização adequada

---

## Funcionalidades

### 1. Módulo de Produtos (CRUD)

- **Listagem de produtos**

  - Carrega os dados a partir da API configurada em `environment.apiUrl`.
  - Exibe colunas: **Nome**, **Preço**, **Código de Barras**.
  - Ações em cada linha:
    - **Editar** → navega para o formulário na rota `/products/edit/:id`.
    - **Excluir** → remove via API e atualiza a lista.
    - **Adicionar ao Carrinho** → envia o produto para o `CartService`.

- **Tabela de Produtos como componente isolado**

  - Componente de tabela recebe os produtos via `@Input()`.
  - Emite eventos via `@Output()` para:
    - Editar
    - Excluir
    - Adicionar ao Carrinho

- **Cadastro / Edição (Reactive Forms)**

  - Formulário baseado em **Reactive Forms**.
  - Validações:
    - Campos obrigatórios (`name`, `price`, `barcode`)
    - Preço numérico e não negativo
  - Suporta:
    - **Criação** (`/products/new`)
    - **Edição** (`/products/edit/:id`)

- **Exclusão**
  - Chamada HTTP `DELETE` via `ProductService`.
  - Atualização imediata da tabela no frontend.

---

### 2. Módulo de Carrinho de Compras

- **Lógica de estado via `CartService`**

  - Armazena a lista de itens do carrinho (`CartItem`).
  - Impede:
    - Produtos sem ID
    - Preço menor ou igual a zero
    - Quantidade menor ou igual a zero
  - Itens duplicados são tratados incrementando a **quantidade**.

- **Persistência com `localStorage`**

  - Carrega o estado inicial do carrinho a partir do `localStorage`.
  - Salva automaticamente a cada alteração.
  - Remove dados inválidos ou corrompidos.

- **Observables para o app inteiro**

  - `cartItems$` → fluxo de itens no carrinho.
  - `cartCount$` → quantidade total de itens (usado no header).
  - `cartTotal$` → valor total da compra.

- **Página de Carrinho**

  - Lista os itens selecionados com nome, preço, quantidade e subtotal.
  - Permite:
    - Alterar quantidade de um item.
    - Remover itens.
    - Ver o total da compra calculado dinamicamente.

- **Header com contador de itens**
  - Mostra algo como **"Carrinho (3)"**.
  - Se inscreve em `cartCount$` para atualizar automaticamente ao:
    - Adicionar item
    - Remover item
    - Alterar quantidade

---

## Arquitetura e Organização

### Estrutura (resumo)

```text
src/
  app/
    cart/            -> Tela de itens do carrinho
    footer/          -> Rodapé fixo no fim da página
    header/          -> Navbar com título e contador do carrinho
    home/            -> Página inicial com atalhos de navegação
    models/
      product.model.ts
      cart-item.model.ts
    product-form/    -> Tela de cadastro/edição (Reactive Form)
    product-list/    -> Tela de listagem de produtos
    product-table/   -> Tabela reutilizável de produtos
    services/
      product.service.ts
      cart.service.ts
  environments/
    environment.ts   -> URL da API
```

---

## 🔧 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (versão 18+)
- **Angular CLI** (versão 18+)
  ```bash
  npm install -g @angular/cli
  ```
- **API Java (Backend)** rodando em `http://localhost:8080`

### Passo a passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Alencar7/mini-e-commerce-Minsait
   cd mini-e-commerce-minsait
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure a URL da API:**

   Edite o arquivo `src/environments/environment.development.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:8080/v1/products", //  Ajustar, caso seja necessário
   };
   ```

4. **Certifique-se que o backend está rodando:**

   - A API Java deve estar ativa em `http://localhost:8080`
   - Configure a autenticação no backend para aceitar requisições de `http://localhost:4200`

5. **Rode o projeto:**

   ```bash
   ng serve
   ```

6. **Acesse no navegador:**
   ```
   http://localhost:4200
   ```

---

## Endpoints da API (Backend)

A aplicação consome os seguintes endpoints da API Java:

| Método | Endpoint               | Descrição                  |
| ------ | ---------------------- | -------------------------- |
| GET    | `/v1/products/`        | Lista todos os produtos    |
| GET    | `/v1/products/{id}`    | Busca produto por ID       |
| POST   | `/v1/products/product` | Cria novo produto          |
| PUT    | `/v1/products/update`  | Atualiza produto existente |
| DELETE | `/v1/products/{id}`    | Remove produto             |

### Estrutura do JSON (Product)

```json
{
  "id": 1,
  "name": "Ritalina LA",
  "price": 99.9,
  "barcode": "7891234567890"
}
```

### 🔐 Acesso do frontend às rotas de produtos

A API de produtos é protegida por **Spring Security + JWT**, mas as rotas de produtos foram liberadas para que o frontend possa consumir os dados sem autenticação.

Na API Java (projeto **AppProdutos**), a configuração de segurança está na classe:

`br.com.fabreum.AppProdutos.config.SecurityConfig`

Nesta classe, é importante garantir que exista a seguinte regra:

```java
// Rotas públicas para o e-commerce (consumidas pelo frontend Angular)
.requestMatchers("/v1/products/**").permitAll()


## 🛠️ Tecnologias Utilizadas

- **Angular 18** (standalone components)
- **TypeScript**
- **RxJS** (Observables, BehaviorSubject)
- **Bootstrap 5** (estilização responsiva)
- **LocalStorage API** (persistência do carrinho)
- **Reactive Forms** (formulários reativos com validação)
- **HttpClient** (requisições HTTP)

---

### Requisitos Funcionais
- Listagem de produtos da API
- Tabela de produtos como componente isolado (com @Input e @Output)
- Botão "Adicionar ao Carrinho" em cada produto
- Formulários com Reactive Forms e validações
- Exclusão de produtos via API
- Carrinho com persistência em LocalStorage
- Página do carrinho com total calculado dinamicamente
- Botão para remover itens do carrinho
- Header com contador de itens atualizado automaticamente

### Requisitos Técnicos
- **ProductService** exclusivo para chamadas HTTP
- **CartService** exclusivo para gerenciar estado do carrinho
- Interface `Product` com tipagem forte (sem `any`)
- Código organizado e sem erros no console
- Commits organizados por feature
- README completo e detalhado

---

## Decisões Técnicas

### Por que BehaviorSubject no CartService?
Escolhi `BehaviorSubject` ao invés de `Subject` para que novos inscritos recebam o último valor emitido automaticamente (estado inicial do carrinho ao carregar a página).

### Por que Reactive Forms?
Mais poderoso que Template-Driven Forms para validações complexas, melhor controle programático e fácil integração com a API.

### Por que LocalStorage?
- Simplicidade e atende o requisito do projeto
- Não requer autenticação de usuário
- Dados persistem mesmo após fechar o navegador

### Standalone Components (Angular 18)
Utilizei a nova abordagem de componentes standalone do Angular 18, eliminando a necessidade de módulos (NgModule), tornando o código mais modular e simples.

---

## Limitações Conhecidas

- O backend precisa estar rodando na porta **8080** (configurável em `environment.ts`)
- Carrinho é armazenado localmente (não sincroniza entre dispositivos)
- Não há autenticação de usuários
- Não há paginação na listagem de produtos

---

## Melhorias Futuras

- Implementar busca e filtros de produtos
- Adicionar paginação na listagem
- Implementar autenticação de usuários
- Sincronizar carrinho com backend
-  Adicionar imagens aos produtos
- Implementar finalização de compra
- Adicionar testes unitários (80%+ cobertura)

---

## Desenvolvido por

**[Adriano Rodrigues de Alencar]**
- GitHub: [@Alencar7](https://github.com/Alencar7)
- LinkedIn: [Adriano R. de Alencar](www.linkedin.com/in/dev-adrianodealencar)
- Email: dinhoalencaraa@gmail.com || contato.adealencar@gmail.com

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte da **Capacitação Minsait**.

---

**Projeto desenvolvido com muita paciencia, muita raiva e MUITO café!**
```
