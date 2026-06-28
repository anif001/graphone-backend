const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

const INVESTOR_TYPES = Object.freeze(['VC', 'Angel', 'Corporate', 'Accelerator', 'Other']);

const PRODUCT_CATEGORIES = Object.freeze([
  'LLM', 'Chatbot', 'API Platform', 'Image Generation', 'Video Generation',
  'Speech Recognition', 'Speech Synthesis', 'Code Assistant', 'Search Engine',
  'Vector Database', 'MLOps', 'Data Platform', 'Content Generation',
  'Writing Assistant', 'Design AI', 'Hardware', 'Framework', 'Other',
]);

module.exports = { ROLES, INVESTOR_TYPES, PRODUCT_CATEGORIES };
