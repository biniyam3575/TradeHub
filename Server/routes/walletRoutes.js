const express = require('express');
const router = express.Router();
const { getBalance, requestCashOut } = require('../controllers/walletController');

router.get('/:userId', getBalance);
router.post('/cash-out', requestCashOut);

module.exports = router;