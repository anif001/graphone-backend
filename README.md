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

## API Endpoints

### Companies
- `GET /api/v1/companies` — List companies (paginated, searchable, sortable)
- `GET /api/v1/companies/:slug` — Company profile with relationships

### Investors
- `GET /api/v1/investors` — List investors (filterable by type)
- `GET /api/v1/investors/:slug` — Investor profile with portfolio

### Products
- `GET /api/v1/products` — List products (filterable by category)
- `GET /api/v1/products/:slug` — Product details

### Founders
- `GET /api/v1/founders` — List founders (searchable)
- `GET /api/v1/founders/:slug` — Founder profile with companies

### News
- `GET /api/v1/news` — List news articles (filterable by source)
- `GET /api/v1/news/:slug` — Article details

### Search & Discovery
- `GET /api/v1/search?q=` — Unified search across all entities
- `GET /api/v1/feed` — Chronological activity feed
- `GET /api/v1/trending` — Trending companies (by recent activity)
- `GET /api/v1/stats` — Ecosystem statistics

### System
- `GET /api/v1/health` — Health check
- `GET /api/v1/docs` — Swagger documentation

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
