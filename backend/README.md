# GraphOne API

AI Ecosystem Directory API — explore companies, investors, founders, products, funding rounds, and news in the artificial intelligence landscape.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Database:** PostgreSQL (via Supabase)
- **Caching:** node-cache (in-memory)
- **Auth:** Bearer token

## Quick Start

```bash
# Install dependencies
npm install

# Copy and fill environment variables
cp .env.example .env

# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `development`, `production`, or `test` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for seeding) |
| `SUPABASE_DIRECT_URL` | Direct PostgreSQL connection string (for migrations) |
| `API_AUTH_TOKEN` | Bearer token for authenticated endpoints |

## Base URL

**`https://graphone-backend.onrender.com`**

All endpoints are prefixed with `/api/v1`.

---

### Root

**`GET https://graphone-backend.onrender.com/api/v1/`**

Returns API info.

<details>
<summary>Sample Response</summary>

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "name": "GraphOne API",
    "version": "1.0.0",
    "description": "AI Ecosystem Platform Backend",
    "status": "running",
    "timestamp": "2026-06-28T11:04:38.011Z"
  }
}
```

</details>

---

### Companies

**`GET https://graphone-backend.onrender.com/api/v1/companies`**

List companies. Query params: `page`, `limit`, `search`, `sort` (name|founded_year|created_at), `order` (asc|desc).

<details>
<summary>Sample Response</summary>

```json
{
  "companies": [
    { "name": "Adept AI", "slug": "adept-ai" },
    { "name": "Anthropic", "slug": "anthropic" }
  ],
  "total": 58,
  "page": 1,
  "limit": 2
}
```

</details>

**`GET https://graphone-backend.onrender.com/api/v1/companies/:slug`**

Company profile with founders, products, funding rounds, investors, news, and related companies.

---

### Investors

**`GET https://graphone-backend.onrender.com/api/v1/investors`**

List investors. Query params: `page`, `limit`, `type` (VC|Angel|Corporate|Accelerator|Other).

<details>
<summary>Sample Response</summary>

```json
{
  "investors": [
    { "name": "Accel", "slug": "accel", "type": "VC" },
    { "name": "Air Street Capital", "slug": "air-street-capital", "type": "VC" }
  ],
  "total": 23,
  "page": 1,
  "limit": 2
}
```

</details>

**`GET https://graphone-backend.onrender.com/api/v1/investors/:slug`**

Investor profile with portfolio companies and led funding rounds.

---

### Products

**`GET https://graphone-backend.onrender.com/api/v1/products`**

List products. Query params: `page`, `limit`, `category`.

**`GET https://graphone-backend.onrender.com/api/v1/products/:slug`**

Product details with parent company.

---

### Founders

**`GET https://graphone-backend.onrender.com/api/v1/founders`**

List founders. Query params: `page`, `limit`, `search`.

**`GET https://graphone-backend.onrender.com/api/v1/founders/:slug`**

Founder profile with associated companies.

---

### News

**`GET https://graphone-backend.onrender.com/api/v1/news`**

List news articles. Query params: `page`, `limit`, `source`.

**`GET https://graphone-backend.onrender.com/api/v1/news/:slug`**

Article details with related companies.

---

### Search & Discovery

**`GET https://graphone-backend.onrender.com/api/v1/search?q=openai`**

Unified search across companies, investors, founders, products, and news. Query: `q` (required, min 2 chars), `limit`.

<details>
<summary>Sample Response</summary>

```json
{
  "query": "openai",
  "companies": [{ "name": "OpenAI", "slug": "openai", "founded_year": 2015 }],
  "investors": [{ "name": "Andreessen Horowitz", "slug": "andreessen-horowitz", "type": "VC" }],
  "founders": [],
  "products": [],
  "news": []
}
```

</details>

**`GET https://graphone-backend.onrender.com/api/v1/feed`**

Chronological activity feed (news, funding rounds, product launches). Query: `page`, `limit`.

<details>
<summary>Sample Response</summary>

```json
{
  "items": [
    { "type": "news", "title": "Databricks Hits $43 Billion Valuation After $500M Raise" }
  ],
  "total": 205,
  "page": 1,
  "limit": 1
}
```

</details>

**`GET https://graphone-backend.onrender.com/api/v1/trending`**

Trending companies ranked by recent activity. Query: `limit`, `days`.

<details>
<summary>Sample Response</summary>

```json
{
  "companies": [
    { "name": "OpenAI", "trendingScore": 0 },
    { "name": "Anthropic", "trendingScore": 0 }
  ]
}
```

</details>

**`GET https://graphone-backend.onrender.com/api/v1/stats`**

Ecosystem statistics.

<details>
<summary>Sample Response</summary>

```json
{
  "totalCompanies": 58,
  "totalInvestors": 23,
  "totalFounders": 29,
  "totalProducts": 70,
  "totalFundingRounds": 112,
  "totalNewsArticles": 43,
  "totalFundingUSD": 32235100000,
  "investorTypeBreakdown": { "VC": 20, "Accelerator": 1, "Angel": 1, "Corporate": 1 },
  "productCategoryBreakdown": { "Chatbot": 4, "LLM": 7, "Image Generation": 3, ... }
}
```

</details>

---

### System

**`GET https://graphone-backend.onrender.com/api/v1/health`**

Health check with server uptime.

<details>
<summary>Sample Response</summary>

```json
{
  "statusCode": 200,
  "success": true,
  "data": { "uptime": 110.18, "timestamp": 1782644684834 }
}
```

</details>

**`GET https://graphone-backend.onrender.com/api/v1/docs`**

Interactive Swagger/OpenAPI documentation UI.

## Project Structure

```
├── server.js                # Entry point
├── src/
│   ├── config/              # Configuration, database, swagger, migrations
│   ├── constants/           # Enums and constants
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth, cache, rate limiting, validation, error handling
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic and database queries
│   ├── utils/               # ApiError, ApiResponse, asyncHandler
│   ├── validators/          # Request validation rules
│   └── seed/                # Seed data and runner
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed database with sample data |

## License

MIT
