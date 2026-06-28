const { Router } = require('express');
const { getFeed } = require('../controllers/feed');
const validate = require('../middleware/validate');
const { pagination } = require('../validators');

const router = Router();

router.get('/', validate(pagination), getFeed);

module.exports = router;
