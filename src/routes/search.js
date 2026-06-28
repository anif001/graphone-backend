const { Router } = require('express');
const { searchAll } = require('../controllers/search');
const validate = require('../middleware/validate');
const { searchQuery } = require('../validators');

const router = Router();

router.get('/', validate(searchQuery), searchAll);

module.exports = router;
