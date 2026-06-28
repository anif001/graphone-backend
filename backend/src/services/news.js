const getSupabase = require('../config/database');

class NewsService {
  async findBySlug(slug) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  }

  async findAll({ page = 1, limit = 20, search, source, sortBy = 'published_at', sortOrder = 'desc' }) {
    const supabase = getSupabase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('news_articles').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (source) {
      query = query.eq('source', source);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async getCompanies(newsId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('company_news')
      .select('companies(*)')
      .eq('news_id', newsId);
    if (error) return [];
    return data.map(row => row.companies).filter(Boolean);
  }
}

module.exports = new NewsService();
