const { Router } = require('express');
const { searchAll } = require('../controllers/search');

const router = Router();

router.get('/', searchAll);

module.exports = router;
