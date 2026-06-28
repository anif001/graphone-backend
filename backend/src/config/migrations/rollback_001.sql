-- Rollback 001_initial_schema.sql
-- Drops all tables and functions created in the initial migration

DROP TRIGGER IF EXISTS funding_rounds_updated_at ON funding_rounds;
DROP TRIGGER IF EXISTS products_updated_at ON products;
DROP TRIGGER IF EXISTS founders_updated_at ON founders;
DROP TRIGGER IF EXISTS investors_updated_at ON investors;
DROP TRIGGER IF EXISTS companies_updated_at ON companies;

DROP FUNCTION IF EXISTS set_updated_at();

DROP TABLE IF EXISTS company_news;
DROP TABLE IF EXISTS company_founders;
DROP TABLE IF EXISTS company_investors;
DROP TABLE IF EXISTS news_articles;
DROP TABLE IF EXISTS funding_rounds;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS founders;
DROP TABLE IF EXISTS investors;
DROP TABLE IF EXISTS companies;
