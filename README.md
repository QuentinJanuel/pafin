# pafin Tech Assignment - Backend Data Handling

This project is a RESTful API that allows users to create, retrieve, update, and delete data on a PostgreSQL database.

## Setup

### Clone

First, clone this repository:

```bash
git clone git@github.com:QuentinJanuel/pafin.git
cd pafin
```

### Node

Make sure you have Node and npm installed on your machine.
Then install the dependencies:

```bash
npm install
```

### Databases

This project uses two PostgreSQL databases (because one is for testing).
They can be easily generated using docker-compose:

```bash
docker-compose up --build
```

You then need to prepare the databases:

```bash
npx prisma generate
npm run setup-dev
npm run setup-prod
```

## Running the project

You can run the project using:

```bash
npm run start
```

## Testing the project

This project uses Jest for testing.
You can run the tests using:

```bash
npm run test
```

## Linting

You can check the code style using:

```bash
npm run lint
```
