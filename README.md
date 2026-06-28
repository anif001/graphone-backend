# GraphOne API

GraphOne API is a REST API for exploring the AI ecosystem. It provides information about AI companies, investors, founders, products, funding rounds, and news through a modular backend built with Node.js, Express, and Supabase.

## Table of Contents

* Overview
* Features
* Technology Stack
* Installation
* Environment Variables
* Project Structure
* API Endpoints
* Authentication
* Swagger Documentation
* Available Scripts
* Deployment
* License

---

## Overview

The API provides endpoints for:

* Companies
* Investors
* Founders
* Products
* Funding Rounds
* News Articles
* Search
* Trending Companies
* Ecosystem Statistics

Base URL

```text
https://graphone-backend.onrender.com/api/v1
```

---

## Features

* RESTful API architecture
* PostgreSQL database using Supabase
* Swagger documentation
* Pagination and filtering
* Search across multiple entities
* Trending companies endpoint
* Ecosystem statistics
* Health monitoring
* Rate limiting
* Response caching
* Authentication for protected routes

---

## Technology Stack

| Technology | Purpose           |
| ---------- | ----------------- |
| Node.js    | Runtime           |
| Express.js | Web Framework     |
| PostgreSQL | Database          |
| Supabase   | Database Hosting  |
| Swagger    | API Documentation |
| Node Cache | Response Caching  |
| Render     | Deployment        |

---

## Installation

Clone the repository.

```bash
git clone https://github.com/anif001/graphone-backend.git

cd graphone-backend/backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=3000

NODE_ENV=development

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_DIRECT_URL=

API_AUTH_TOKEN=
```

Run migrations.

```bash
npm run migrate
```

Seed the database.

```bash
npm run seed
```

Start the server.

```bash
npm run dev
```

---

## Project Structure

```text
backend/
│
├── server.js
├── package.json
├── render.yaml
│
└── src
    ├── config
    ├── constants
    ├── controllers
    ├── middleware
    ├── routes
    ├── services
    ├── validators
    ├── utils
    ├── seed
    └── config/migrations
```

---

## API Endpoints

### Root

| Method | Endpoint |
| ------ | -------- |
| GET    | `/`      |

Returns API metadata.

---

### Companies

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/companies`       |
| GET    | `/companies/:slug` |

Query Parameters

| Parameter | Description                    |
| --------- | ------------------------------ |
| page      | Page number                    |
| limit     | Results per page               |
| search    | Company name                   |
| sort      | name, founded_year, created_at |
| order     | asc, desc                      |

---

### Investors

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/investors`       |
| GET    | `/investors/:slug` |

Query Parameters

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| page      | Page number                              |
| limit     | Results per page                         |
| type      | VC, Angel, Corporate, Accelerator, Other |

---

### Products

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/products`       |
| GET    | `/products/:slug` |

---

### Founders

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/founders`       |
| GET    | `/founders/:slug` |

---

### News

| Method | Endpoint      |
| ------ | ------------- |
| GET    | `/news`       |
| GET    | `/news/:slug` |

---

### Search

| Method | Endpoint     |
| ------ | ------------ |
| GET    | `/search?q=` |

Searches across companies, investors, founders, products, and news.

---

### Feed

| Method | Endpoint |
| ------ | -------- |
| GET    | `/feed`  |

Returns the latest ecosystem activity.

---

### Trending

| Method | Endpoint    |
| ------ | ----------- |
| GET    | `/trending` |

Returns trending AI companies.

---

### Statistics

| Method | Endpoint |
| ------ | -------- |
| GET    | `/stats` |

Returns ecosystem statistics.

---

### Health

| Method | Endpoint  |
| ------ | --------- |
| GET    | `/health` |

Returns server health and uptime.

---

## Authentication

Protected endpoints require a Bearer token.

```
Authorization: Bearer YOUR_API_AUTH_TOKEN
```

---

## Swagger Documentation

Interactive API documentation is available at:

```
/api/v1/docs
```

---

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| npm run dev     | Start development server |
| npm start       | Start production server  |
| npm run migrate | Run database migrations  |
| npm run seed    | Populate the database    |

---

## Deployment

Backend: Render

Database: Supabase PostgreSQL

---

## License

MIT
