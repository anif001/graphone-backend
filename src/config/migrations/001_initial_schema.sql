-- GraphOne Initial Schema
-- Creates all tables, relationships, indexes, and constraints

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(300),
  website VARCHAR(500),
  logo_url VARCHAR(500),
  location VARCHAR(255),
  founded_year SMALLINT,
  employee_count VARCHAR(50),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  github_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_slug ON companies (slug);
CREATE INDEX idx_companies_name ON companies (name);
CREATE INDEX idx_companies_founded_year ON companies (founded_year);

-- ============================================================
-- INVESTORS
-- ============================================================
CREATE TABLE investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('VC', 'Angel', 'Corporate', 'Accelerator', 'Other')),
  website VARCHAR(500),
  logo_url VARCHAR(500),
  description TEXT,
  location VARCHAR(255),
  founded_year SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_investors_slug ON investors (slug);
CREATE INDEX idx_investors_type ON investors (type);

-- ============================================================
-- FOUNDERS
-- ============================================================
CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_founders_slug ON founders (slug);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  category VARCHAR(100),
  launch_date DATE,
  github_url VARCHAR(500),
  pricing_model VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_company_id ON products (company_id);
CREATE INDEX idx_products_category ON products (category);

-- ============================================================
-- FUNDING ROUNDS
-- ============================================================
CREATE TABLE funding_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  round_name VARCHAR(100) NOT NULL,
  amount_raised NUMERIC(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  valuation NUMERIC(15, 2),
  announcement_date DATE,
  lead_investor_id UUID REFERENCES investors(id) ON DELETE SET NULL,
  source_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_funding_rounds_company_id ON funding_rounds (company_id);
CREATE INDEX idx_funding_rounds_lead_investor_id ON funding_rounds (lead_investor_id);
CREATE INDEX idx_funding_rounds_announcement_date ON funding_rounds (announcement_date);

-- ============================================================
-- NEWS ARTICLES
-- ============================================================
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  source VARCHAR(255),
  published_at TIMESTAMPTZ,
  author VARCHAR(255),
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_articles_slug ON news_articles (slug);
CREATE INDEX idx_news_articles_published_at ON news_articles (published_at);
CREATE INDEX idx_news_articles_source ON news_articles (source);

-- ============================================================
-- JUNCTION: COMPANY <-> INVESTORS (Many-to-Many)
-- ============================================================
CREATE TABLE company_investors (
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, investor_id)
);

CREATE INDEX idx_company_investors_investor_id ON company_investors (investor_id);

-- ============================================================
-- JUNCTION: COMPANY <-> FOUNDERS (Many-to-Many)
-- ============================================================
CREATE TABLE company_founders (
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, founder_id)
);

CREATE INDEX idx_company_founders_founder_id ON company_founders (founder_id);

-- ============================================================
-- JUNCTION: COMPANY <-> NEWS ARTICLES (Many-to-Many)
-- ============================================================
CREATE TABLE company_news (
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  news_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, news_id)
);

CREATE INDEX idx_company_news_news_id ON company_news (news_id);

-- ============================================================
-- UPDATED_AT TRIGGER (auto-set on row modification)
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER investors_updated_at BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER founders_updated_at BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER funding_rounds_updated_at BEFORE UPDATE ON funding_rounds
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
