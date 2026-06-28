const getSupabase = require('../config/database');

class FeedService {
  async getFeed({ page = 1, limit = 20 }) {
    const supabase = getSupabase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const [newsResult, fundingResult, productResult] = await Promise.all([
      supabase.from('news_articles')
        .select('id, title, slug, description, source, published_at, url, image_url, created_at')
        .order('published_at', { ascending: false })
        .range(0, 50),
      supabase.from('funding_rounds')
        .select('id, round_name, amount_raised, currency, valuation, announcement_date, company:company_id(name, slug, logo_url)')
        .order('announcement_date', { ascending: false })
        .range(0, 50),
      supabase.from('products')
        .select('id, name, slug, description, category, launch_date, company:company_id(name, slug)')
        .order('launch_date', { ascending: false })
        .range(0, 50),
    ]);

    const items = [];

    for (const article of (newsResult.data || [])) {
      items.push({
        type: 'news',
        id: article.id,
        title: article.title,
        description: article.description,
        slug: article.slug,
        source: article.source,
        url: article.url,
        imageUrl: article.image_url,
        date: article.published_at || article.created_at,
        sortDate: new Date(article.published_at || article.created_at).getTime(),
      });
    }

    for (const round of (fundingResult.data || [])) {
      items.push({
        type: 'funding',
        id: round.id,
        title: `${round.company?.name || 'Unknown'} raises ${formatAmount(round.amount_raised)} ${round.round_name}`,
        description: `${round.round_name} round of ${formatAmount(round.amount_raised)}${round.valuation ? ` at ${formatAmount(round.valuation)} valuation` : ''}`,
        slug: round.company?.slug,
        companyName: round.company?.name,
        companySlug: round.company?.slug,
        companyLogo: round.company?.logo_url,
        amountRaised: round.amount_raised,
        roundName: round.round_name,
        date: round.announcement_date,
        sortDate: new Date(round.announcement_date).getTime(),
      });
    }

    for (const product of (productResult.data || [])) {
      if (!product.launch_date) continue;
      items.push({
        type: 'product',
        id: product.id,
        title: `${product.company?.name || 'Unknown'} launches ${product.name}`,
        description: product.description,
        slug: product.slug,
        companyName: product.company?.name,
        companySlug: product.company?.slug,
        category: product.category,
        date: product.launch_date,
        sortDate: new Date(product.launch_date).getTime(),
      });
    }

    items.sort((a, b) => b.sortDate - a.sortDate);

    const paginated = items.slice(from, to + 1);

    return { items: paginated, total: items.length, page, limit };
  }
}

function formatAmount(num) {
  if (!num) return '';
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num}`;
}

module.exports = new FeedService();
