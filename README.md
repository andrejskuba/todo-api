# TODO list API

Todo list REST api build on [Nest](https://github.com/nestjs/nest) framework using PostgreSQL as DB engine.

## Installation

```bash
$ npm install
```

## Configuration

App is configurable via `.env` file with following content:

```bash
DB_HOST=host
DB_PORT=5432
DB_USER=user
DB_PASS=password
DB_NAME=todo_db
JWT_SECRET=superLongSecret
```

## Running the app

First you need to run DB migrations:

```bash
$ npm run db:migrate
```

Then start server:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API documentation

Documentation of endpoints is build by swagger and can be found under http://localhost:3000/api