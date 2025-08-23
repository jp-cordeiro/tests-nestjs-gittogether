## Descrição

Talk apresentada no evento Git Together Fortaleza no dia 23/08/2025 com o tema de Testes Automatizados de Software e com o nome: "Terminei, só falta testar! Testando aplicações com NestJS".

Busco nessa apresentação falar um pouco sobre:

Os sete princípios dos Testes de Software:

1 - Testes mostram a presença de defeitos, não sua ausência;
2 - Testes exaustivos são impossíveis;
3 - Testes antecipados economizam tempo e dinheiro;
4 - Agrupamento de Defeitos;
5 - Paradoxo da Pesticida;
6 - Testes dependem do contexto;
7 - A ilusão de ausência de erros.

E um pouco sobre como testar uma aplicação NestJS com Jest.


Link da apresentação: ['Terminei, só falta testar! Testando aplicações com NestJS']('https://docs.google.com/presentation/d/1Cy4ZhoyD42P3Zm-d4Hxz7AbjoZiRESNQsyz3MtBhkgI/edit?usp=sharing')

## Iniciar o projeto

```bash
$ yarn install
```

## Rodar o projeto

```bash
# rodar o projeto
$ yarn run start

# rodar em modo de desenvolvimento
$ yarn run start:dev
```

## Rodar os testes

```bash
# Testes E2E
$ yarn run test:e2e
```

## Rodar com docker

```bash
# Por padrão o projeto irá rodar em modo debug
$ docker-compose up -d
```

## Attach de debug no vscode

Após rodar o docker-compose e criar o container, é só ligar o modo debug na aba debug do VSCODE com a opção: Attach to Docker Container, o projeto já estará debugando automaticamente a partir da container Docker.
