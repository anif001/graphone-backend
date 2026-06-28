const getSupabase = require('../config/database');
const config = require('../config');
const companies = require('./data/companies');
const investors = require('./data/investors');
const founders = require('./data/founders');
const products = require('./data/products');
const fundingRounds = require('./data/fundingRounds');
const newsArticles = require('./data/newsArticles');
const { companyInvestors, companyFounders, companyNews } = require('./data/relationships');

async function seed() {
  if (!config.supabase.serviceRoleKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required for seeding.');
    process.exit(1);
  }

  const supabase = getSupabase();

  console.log('Starting seed...\n');

  // ── Clear existing data (reverse FK order) ──
  console.log('Clearing existing data...');
  await supabase.from('company_news').delete().neq('company_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('company_founders').delete().neq('company_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('company_investors').delete().neq('company_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('funding_rounds').delete().neq('company_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('company_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('news_articles').delete().neq('title', 'DELETE_ALL');
  await supabase.from('founders').delete().neq('name', 'DELETE_ALL');
  await supabase.from('investors').delete().neq('name', 'DELETE_ALL');
  await supabase.from('companies').delete().neq('name', 'DELETE_ALL');
  console.log('  ✓ Existing data cleared\n');

  // ── Helper: upsert by slug ──
  async function upsert(table, data, slugField = 'slug') {
    const { error } = await supabase.from(table).upsert(data, { onConflict: slugField, ignoreDuplicates: false });
    if (error) {
      if (error.message.includes('violates row-level security')) {
        console.error(`  ✗ RLS policy blocks ${table}. Enable "Allow public access" or disable RLS temporarily.`);
      } else if (error.message.includes('is not present in table')) {
        console.error(`  ✗ Table "${table}" does not exist. Run migrations first.`);
      } else {
        console.error(`  ✗ Error inserting into ${table}:`, error.message);
      }
      return false;
    }
    return true;
  }

  // ── 1. Companies ──
  console.log('Inserting companies...');
  const companySlugMap = {};
  for (const company of companies) {
    const ok = await upsert('companies', company);
    if (ok) companySlugMap[company.slug] = true;
  }
  console.log(`  ✓ ${companies.length} companies inserted\n`);

  // ── 2. Investors ──
  console.log('Inserting investors...');
  const investorSlugMap = {};
  for (const investor of investors) {
    const ok = await upsert('investors', investor);
    if (ok) investorSlugMap[investor.slug] = true;
  }
  console.log(`  ✓ ${investors.length} investors inserted\n`);

  // ── 3. Founders ──
  console.log('Inserting founders...');
  const founderSlugMap = {};
  for (const founder of founders) {
    const ok = await upsert('founders', founder);
    if (ok) founderSlugMap[founder.slug] = true;
  }
  console.log(`  ✓ ${founders.length} founders inserted\n`);

  // ── 4. Products ──
  console.log('Inserting products...');
  let productCount = 0;
  for (const product of products) {
    if (!companySlugMap[product.companySlug]) {
      console.log(`  ⚠ Skipping product "${product.name}" — company "${product.companySlug}" not found`);
      continue;
    }
    const { companySlug, ...productData } = product;
    const { error } = await supabase.from('products').upsert(
      { ...productData, company_id: null },
      { onConflict: 'slug', ignoreDuplicates: false }
    );
    if (error) {
      console.error(`  ✗ Error inserting product "${product.name}":`, error.message);
    } else {
      productCount++;
    }
  }
  // We need the actual company UUID — let us do a bulk approach instead
  // Fetch all company IDs by slug
  const { data: companyRows } = await supabase.from('companies').select('id, slug');
  const slugToId = {};
  for (const row of (companyRows || [])) {
    slugToId[row.slug] = row.id;
  }

  for (const product of products) {
    const companyId = slugToId[product.companySlug];
    if (!companyId) continue;
    const { companySlug, ...productData } = product;
    const { error } = await supabase.from('products').upsert(
      { ...productData, company_id: companyId },
      { onConflict: 'slug', ignoreDuplicates: false }
    );
    if (error) {
      console.error(`  ✗ Error inserting product "${product.name}":`, error.message);
    } else {
      productCount++;
    }
  }
  console.log(`  ✓ ${productCount} products inserted\n`);

  // ── 5. Investors slug to id ──
  const { data: investorRows } = await supabase.from('investors').select('id, slug');
  const investorSlugToId = {};
  for (const row of (investorRows || [])) {
    investorSlugToId[row.slug] = row.id;
  }

  // ── 6. Funding Rounds ──
  console.log('Inserting funding rounds...');
  let fundingCount = 0;
  for (const round of fundingRounds) {
    const companyId = slugToId[round.companySlug];
    if (!companyId) {
      console.log(`  ⚠ Skipping funding round for "${round.companySlug}" — company not found`);
      continue;
    }
    const leadInvestorId = round.leadInvestorSlug ? (investorSlugToId[round.leadInvestorSlug] || null) : null;
    const { companySlug, leadInvestorSlug, ...roundData } = round;
    const { error } = await supabase.from('funding_rounds').upsert(
      { ...roundData, company_id: companyId, lead_investor_id: leadInvestorId },
      { onConflict: 'id', ignoreDuplicates: false }
    );
    if (error) {
      console.error(`  ✗ Error inserting funding round for "${round.companySlug}":`, error.message);
    } else {
      fundingCount++;
    }
  }
  console.log(`  ✓ ${fundingCount} funding rounds inserted\n`);

  // ── 7. News Articles ──
  console.log('Inserting news articles...');
  let newsCount = 0;
  for (const article of newsArticles) {
    const { error } = await supabase.from('news_articles').upsert(article, { onConflict: 'slug', ignoreDuplicates: false });
    if (error) {
      console.error(`  ✗ Error inserting article "${article.title}":`, error.message);
    } else {
      newsCount++;
    }
  }
  console.log(`  ✓ ${newsCount} news articles inserted\n`);

  // ── 8. News articles slug to id ──
  const { data: newsRows } = await supabase.from('news_articles').select('id, slug');
  const newsSlugToId = {};
  for (const row of (newsRows || [])) {
    newsSlugToId[row.slug] = row.id;
  }

  // ── 9. Founders slug to id ──
  const { data: founderRows } = await supabase.from('founders').select('id, slug');
  const founderSlugToId = {};
  for (const row of (founderRows || [])) {
    founderSlugToId[row.slug] = row.id;
  }

  // ── 10. Junction: company_investors ──
  console.log('Inserting company-investor relationships...');
  let ciCount = 0;
  for (const rel of companyInvestors) {
    const companyId = slugToId[rel.companySlug];
    const investorId = investorSlugToId[rel.investorSlug];
    if (!companyId || !investorId) continue;
    const { error } = await supabase.from('company_investors').upsert(
      { company_id: companyId, investor_id: investorId },
      { onConflict: 'company_id, investor_id', ignoreDuplicates: false }
    );
    if (error) console.error(`  ✗ Error:`, error.message); else ciCount++;
  }
  console.log(`  ✓ ${ciCount} company-investor relationships inserted\n`);

  // ── 11. Junction: company_founders ──
  console.log('Inserting company-founder relationships...');
  let cfCount = 0;
  for (const rel of companyFounders) {
    const companyId = slugToId[rel.companySlug];
    const founderId = founderSlugToId[rel.founderSlug];
    if (!companyId || !founderId) continue;
    const { error } = await supabase.from('company_founders').upsert(
      { company_id: companyId, founder_id: founderId },
      { onConflict: 'company_id, founder_id', ignoreDuplicates: false }
    );
    if (error) console.error(`  ✗ Error:`, error.message); else cfCount++;
  }
  console.log(`  ✓ ${cfCount} company-founder relationships inserted\n`);

  // ── 12. Junction: company_news ──
  console.log('Inserting company-news relationships...');
  let cnCount = 0;
  for (const rel of companyNews) {
    const companyId = slugToId[rel.companySlug];
    const newsId = newsSlugToId[rel.newsSlug];
    if (!companyId || !newsId) continue;
    const { error } = await supabase.from('company_news').upsert(
      { company_id: companyId, news_id: newsId },
      { onConflict: 'company_id, news_id', ignoreDuplicates: false }
    );
    if (error) console.error(`  ✗ Error:`, error.message); else cnCount++;
  }
  console.log(`  ✓ ${cnCount} company-news relationships inserted\n`);

  console.log('Seed complete!');
  console.log(`  Companies: ${companies.length}`);
  console.log(`  Investors: ${investors.length}`);
  console.log(`  Founders: ${founders.length}`);
  console.log(`  Products: ${productCount}`);
  console.log(`  Funding Rounds: ${fundingCount}`);
  console.log(`  News Articles: ${newsCount}`);
  console.log(`  Company-Investor links: ${ciCount}`);
  console.log(`  Company-Founder links: ${cfCount}`);
  console.log(`  Company-News links: ${cnCount}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
