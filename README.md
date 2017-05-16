# CRUD
API em NodeJS com Crud simples de gerenciamento de produtos e autenticação utilizando JWT.

## Endpoints

### Cadastro : /v1/user/signup
```
POST /v1/user/signup HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache

{
    "name": "Fulano da Silva",
    "email": "fulano@globo.com",
    "password": "@123!Mudar"
}
```

### Autenticação : /v1/user/login
```
POST /v1/user/login HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache

{
    "email": "fulano@globo.com",
    "password": "@123!Mudar"
}
```

### Listar Produtos : /v1/products
```
GET /v1/products HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache
```

### Listar Produto Específico : /v1/products/591a88d2a85a5656b5330506
```
GET /v1/products/591a88d2a85a5656b5330506 HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache
```

### Criar Produto : /v1/products
```
POST /v1/products HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache

{
    "name": "Produto 1",
    "price": 15,
    "active": true
}
```

### Atualizar Produto : /v1/products/591a88d2a85a5656b5330506
```
PUT /v1/products/591a88d2a85a5656b5330506 HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache

{
    "name": "Produto 1",
    "price": 25,
    "active": true
}
```

### Excluir Produto : /v1/products/591a88d2a85a5656b5330506
```
DELETE /v1/products/591a88d2a85a5656b5330506 HTTP/1.1
Host: localhost:8080
Cache-Control: no-cache
```
