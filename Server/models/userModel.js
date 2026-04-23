const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Logic to register a user + create their wallet
  create: async (userData) => {
    const { full_name, email, password, role } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert User
      const [userResult] = await conn.execute(
        'INSERT INTO Users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [full_name, email, hashedPassword, role || 'customer']
      );

      const userId = userResult.insertId;

      // 2. Automatically create a Wallet for the user
      await conn.execute(
        'INSERT INTO Wallets (user_id, balance) VALUES (?, ?)',
        [userId, 0.00]
      );

      await conn.commit();
      return userId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }
};

module.exports = User;