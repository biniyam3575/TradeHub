const db = require('../config/db');

const Wallet = {
  // Get wallet balance and transaction history
  getWalletData: async (userId) => {
    const [wallet] = await db.execute('SELECT * FROM Wallets WHERE user_id = ?', [userId]);
    const [transactions] = await db.execute(
      'SELECT * FROM Transactions WHERE wallet_id = ? ORDER BY created_at DESC',
      [wallet[0].id]
    );
    return { balance: wallet[0].balance, transactions };
  },

  // Record a transaction (Income or Cash Out)
  processTransaction: async (userId, amount, type, description) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Get Wallet ID
      const [wallet] = await conn.execute('SELECT id FROM Wallets WHERE user_id = ?', [userId]);
      const walletId = wallet[0].id;

      // 2. Update Balance (positive for income, negative for withdrawal)
      await conn.execute(
        'UPDATE Wallets SET balance = balance + ? WHERE id = ?',
        [amount, walletId]
      );

      // 3. Record in Transactions table for auditing
      await conn.execute(
        'INSERT INTO Transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)',
        [walletId, amount, type, description]
      );

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};

module.exports = Wallet;