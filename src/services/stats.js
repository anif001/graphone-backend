const getSupabase = require('../config/database');

class StatsService {
  async getStats() {
    const supabase = getSupabase();

    const [companies, investors, founders, products, funding, news] = await Promise.all([
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('investors').select('*', { count: 'exact', head: true }),
      supabase.from('founders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('funding_rounds').select('amount_raised, currency'),
      supabase.from('news_articles').select('*', { count: 'exact', head: true }),
    ]);

    let totalFunding = 0;
    for (const round of (funding.data || [])) {
      if (round.currency === 'USD' && round.amount_raised) {
        totalFunding += Number(round.amount_raised);
      }
    }

    const investorTypes = await supabase
      .from('investors')
      .select('type');

    const typeCounts = {};
    for (const inv of (investorTypes.data || [])) {
      typeCounts[inv.type] = (typeCounts[inv.type] || 0) + 1;
    }

    const productCategories = await supabase
      .from('products')
      .select('category');

    const catCounts = {};
    for (const p of (productCategories.data || [])) {
      if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    }

    return {
      totalCompanies: companies.count || 0,
      totalInvestors: investors.count || 0,
      totalFounders: founders.count || 0,
      totalProducts: products.count || 0,
      totalFundingRounds: funding.data?.length || 0,
      totalNewsArticles: news.count || 0,
      totalFundingUSD: totalFunding,
      investorTypeBreakdown: typeCounts,
      productCategoryBreakdown: catCounts,
    };
  }
}

module.exports = new StatsService();
