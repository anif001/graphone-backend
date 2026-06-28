const getSupabase = require('../config/database');

class CompaniesService {

  async findBySlug(slug) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  }

  async findAll({ page = 1, limit = 20, search, sortBy = 'name', sortOrder = 'asc' }) {
    const supabase = getSupabase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('companies')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async getFounders(companyId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('company_founders')
      .select('founders(*)')
      .eq('company_id', companyId);

    if (error) return [];
    return data.map(row => row.founders);
  }

  async getProducts(companyId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .order('name', { ascending: true });

    if (error) return [];
    return data;
  }

  async getFundingRounds(companyId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('funding_rounds')
      .select('*, lead_investor:lead_investor_id(*)')
      .eq('company_id', companyId)
      .order('announcement_date', { ascending: false });

    if (error) return [];
    return data;
  }

  async getInvestors(companyId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('company_investors')
      .select('investors(*)')
      .eq('company_id', companyId);

    if (error) return [];
    return data.map(row => row.investors);
  }

  async getNews(companyId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('company_news')
      .select('news_articles(*)')
      .eq('company_id', companyId)
      .order('news_articles(published_at)', { ascending: false });

    if (error) {
      // Fallback: order without nested sorting
      const fb = getSupabase();
      const { data: fallback } = await fb
        .from('company_news')
        .select('news_articles(*)')
        .eq('company_id', companyId);
      return (fallback || []).map(row => row.news_articles);
    }
    return data.map(row => row.news_articles);
  }

  async getRelatedCompanies(companyId) {
    const supabase = getSupabase();
    const { data: investorLinks } = await supabase
      .from('company_investors')
      .select('investor_id')
      .eq('company_id', companyId);

    if (!investorLinks || investorLinks.length === 0) return [];

    const investorIds = investorLinks.map(r => r.investor_id);

    const peersSupabase = getSupabase();
    const { data: peers } = await peersSupabase
      .from('company_investors')
      .select('company_id')
      .in('investor_id', investorIds)
      .neq('company_id', companyId);

    if (!peers || peers.length === 0) return [];

    const peerIds = [...new Set(peers.map(r => r.company_id))];

    const companySupabase = getSupabase();
    const { data: companies } = await companySupabase
      .from('companies')
      .select('id, name, slug, short_description, logo_url, founded_year')
      .in('id', peerIds)
      .limit(10);

    return companies || [];
  }
}

module.exports = new CompaniesService();
