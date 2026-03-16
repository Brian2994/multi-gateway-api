# Multi Gateway Payment API

API de processamento de pagamentos com suporte a múltiplos gateways, failover automático e gerenciamento de transações.

## 📌 Descrição

Este projeto implementa uma API de pagamentos capaz de processar transações utilizando múltiplos gateways de pagamento.

O sistema possui **failover automático**, ou seja, caso um gateway falhe ou demore a responder, a API tenta automaticamente outro gateway disponível.

A aplicação também registra todas as transações realizadas, permitindo consulta, reembolso e histórico de pagamentos.

---

# 🚀 Tecnologias utilizadas

* **Node.js**
* **AdonisJS**
* **TypeScript**
* **Lucid ORM**
* **Docker**
* **Axios**

---

# 🏗 Arquitetura do projeto

O sistema segue uma arquitetura modular:

```
app
 ├ controllers
 │   └ transactions_controller.ts
 │
 ├ services
 │   ├ payment_service.ts
 │   └ gateway_manager.ts
 │
 ├ gateways
 │   ├ gateway1_service.ts
 │   ├ gateway2_service.ts
 │   └ gateway_interface.ts
 │
 ├ models
 │   ├ client.ts
 │   ├ product.ts
 │   ├ transaction.ts
 │   ├ transaction_product.ts
 │   └ gateway.ts
```

Fluxo de processamento:

```
Controller
   ↓
PaymentService
   ↓
GatewayManager
   ↓
Gateway1 / Gateway2
```

---

# ⚙️ Como executar o projeto

### 1️⃣ Clonar o repositório

```
git clone https://github.com/Brian2994/multi-gateway-api.git
```

Entrar na pasta:

```
cd multi-gateway-api
```

---

### 2️⃣ Instalar dependências

```
npm install
```

---

### 3️⃣ Rodar migrations

```
node ace migration:run
```

---

### 4️⃣ Iniciar o servidor

```
npm run dev
```

API rodará em:

```
http://localhost:3333
```

---

# 🐳 Rodar gateways mock (Docker)

Para simular os gateways de pagamento:

```
docker run -p 3001:3001 gateway1
docker run -p 3002:3002 gateway2
```

---

# 📡 Endpoints da API

## Criar pagamento

```
POST /api/v1/purchase
```

### Exemplo request

```json
{
 "name": "Brian",
 "email": "brian@email.com",
 "cardNumber": "4111111111111111",
 "cvv": "123",
 "products": [
   {
     "product_id": 1,
     "quantity": 2
   }
 ]
}
```

---

## Reembolsar transação

```
POST /api/v1/refund/:id
```

---

## Listar transações

```
GET /api/v1/transactions
```

### Paginação

```
GET /transactions?page=2
```

### Filtro por status

```
GET /transactions?status=success
```

---

## Detalhe da transação

```
GET /api/v1/transactions/:id
```

---

## Health check

```
GET /health
```

Resposta:

```json
{
 "status": "ok",
 "api": "running"
}
```

---

# 🔄 Failover de gateways

O sistema tenta processar o pagamento utilizando os gateways ativos na ordem de prioridade.

Se um gateway falhar ou exceder o tempo limite de resposta, o próximo gateway disponível será utilizado automaticamente.

Exemplo de log:

```
Trying gateway1...
gateway1 failed: timeout
Trying gateway2...
gateway2 success
```

---

# 📊 Funcionalidades implementadas

* Processamento de pagamentos
* Failover automático entre gateways
* Timeout para gateways
* Registro de transações
* Reembolso de pagamentos
* Proteção contra reembolso duplicado
* Listagem de transações
* Paginação e filtros
* Detalhe de transação
* Health check da API

---

# 👨‍💻 Autor

Projeto desenvolvido como teste técnico para backend.

Desenvolvedor: **Pablo Brian**