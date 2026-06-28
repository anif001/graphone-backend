const getSupabase = require('../config/database');

class SearchService {
  async search({ q, limit = 5 }) {
    if (!q || q.trim().length < 2) return {};

    const supabase = getSupabase();
    const pattern = `%${q.trim()}%`;

    const [companies, investors, founders, products, news] = await Promise.all([
      supabase.from('companies').select('id, name, slug, short_description, logo_url, founded_year')
        .or(`name.ilike.${pattern},short_description.ilike.${pattern}`).limit(limit),
      supabase.from('investors').select('id, name, slug, type, logo_url')
        .or(`name.ilike.${pattern},description.ilike.${pattern}`).limit(limit),
      supabase.from('founders').select('id, name, slug, title, avatar_url')
        .or(`name.ilike.${pattern},bio.ilike.${pattern}`).limit(limit),
      supabase.from('products').select('id, name, slug, description, category, company:company_id(name, slug)')
        .or(`name.ilike.${pattern},description.ilike.${pattern}`).limit(limit),
      supabase.from('news_articles').select('id, title, slug, description, source, published_at, url')
        .or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(limit),
    ]);

    return {
      query: q.trim(),
      companies: companies.data || [],
      investors: investors.data || [],
      founders: founders.data || [],
      products: products.data || [],
      news: news.data || [],
    };
  }
}

module.exports = new SearchService();
