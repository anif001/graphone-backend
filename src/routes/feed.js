const { Router } = require('express');
const { getFeed } = require('../controllers/feed');

const router = Router();

router.get('/', getFeed);

module.exports = router;
