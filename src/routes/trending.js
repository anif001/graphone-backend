const { Router } = require('express');
const { getTrending } = require('../controllers/trending');

const router = Router();

router.get('/', getTrending);

module.exports = router;
