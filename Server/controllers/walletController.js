const Wallet = require('../models/walletModel');

exports.getBalance = async (req, res) => {
  try {
    // In a real app, userId comes from the JWT token (req.user.id)
    const { userId } = req.params;
    const data = await Wallet.getWalletData(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet', error: error.message });
  }
};

exports.requestCashOut = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    // Logic: Check if they have enough balance before letting them cash out
    const data = await Wallet.getWalletData(userId);
    if (data.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance for cash out' });
    }

    // Process as a negative transaction
    await Wallet.processTransaction(userId, -amount, 'withdrawal', 'Seller Cash Out Request');
    
    res.json({ message: 'Cash out request processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Cash out failed', error: error.message });
  }
};