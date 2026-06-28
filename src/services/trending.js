const getSupabase = require('../config/database');

class TrendingService {
  async getTrending({ limit = 10, days = 30 }) {
    const supabase = getSupabase();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const companies = await supabase
      .from('companies')
      .select('id, name, slug, short_description, logo_url, founded_year')
      .limit(100);

    if (!companies.data) return [];

    const companyIds = companies.data.map(c => c.id);

    const [newsCounts, fundingCounts, productCounts] = await Promise.all([
      supabase.from('company_news')
        .select('company_id, news_articles!inner(published_at)')
        .in('company_id', companyIds),
      supabase.from('funding_rounds')
        .select('company_id')
        .in('company_id', companyIds)
        .gte('announcement_date', cutoff.toISOString().split('T')[0]),
      supabase.from('products')
        .select('company_id')
        .in('company_id', companyIds)
        .gte('launch_date', cutoff.toISOString().split('T')[0]),
    ]);

    const newsMap = {};
    for (const row of (newsCounts.data || [])) {
      const pub = row.news_articles?.published_at;
      if (pub && new Date(pub) >= cutoff) {
        newsMap[row.company_id] = (newsMap[row.company_id] || 0) + 1;
      }
    }

    const fundingMap = {};
    for (const row of (fundingCounts.data || [])) {
      fundingMap[row.company_id] = (fundingMap[row.company_id] || 0) + 1;
    }

    const productMap = {};
    for (const row of (productCounts.data || [])) {
      productMap[row.company_id] = (productMap[row.company_id] || 0) + 1;
    }

    const scored = companies.data.map(c => {
      const newsScore = (newsMap[c.id] || 0) * 3;
      const fundingScore = (fundingMap[c.id] || 0) * 5;
      const productScore = (productMap[c.id] || 0) * 2;
      const totalScore = newsScore + fundingScore + productScore;
      return { ...c, trendingScore: totalScore };
    });

    scored.sort((a, b) => b.trendingScore - a.trendingScore);

    return scored.slice(0, limit);
  }
}

module.exports = new TrendingService();
