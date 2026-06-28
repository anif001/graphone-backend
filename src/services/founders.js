const getSupabase = require('../config/database');

class FoundersService {
  async findBySlug(slug) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('founders')
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

    let query = supabase.from('founders').select('*', { count: 'exact' });
    if (search) {
      query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%`);
    }
    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async getCompanies(founderId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('company_founders')
      .select('companies(*)')
      .eq('founder_id', founderId);
    if (error) return [];
    return data.map(row => row.companies).filter(Boolean);
  }
}

module.exports = new FoundersService();
