const express = require('express');
const syncController = require('../controllers/sync.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', auth, syncController.loadData);
router.post('/', auth, syncController.syncData);

module.exports = router;
