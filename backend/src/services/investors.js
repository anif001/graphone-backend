const getSupabase = require('../config/database');

class InvestorsService {

  async findBySlug(slug) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  }

  async findAll({ page = 1, limit = 20, search, type, sortBy = 'name', sortOrder = 'asc' }) {
    const supabase = getSupabase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('investors').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (type) {
      query = query.eq('type', type);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async getPortfolioCompanies(investorId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('company_investors')
      .select('companies(*)')
      .eq('investor_id', investorId);
    if (error) return [];
    return data.map(row => row.companies).filter(Boolean);
  }

  async getLedFundingRounds(investorId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('funding_rounds')
      .select('*, company:company_id(name, slug, logo_url)')
      .eq('lead_investor_id', investorId)
      .order('announcement_date', { ascending: false });
    if (error) return [];
    return data;
  }
}

module.exports = new InvestorsService();
