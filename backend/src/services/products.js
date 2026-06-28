const getSupabase = require('../config/database');

class ProductsService {
  async findBySlug(slug) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*, company:company_id(*)')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  }

  async findAll({ page = 1, limit = 20, search, category, sortBy = 'name', sortOrder = 'asc' }) {
    const supabase = getSupabase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('products').select('*, company:company_id(name, slug, logo_url)', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }
}

module.exports = new ProductsService();
