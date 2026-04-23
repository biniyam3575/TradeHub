const db = require('../config/db');

const Order = {
  createOrder: async (orderData) => {
    const { customer_id, items, total_amount, shipping_address } = orderData;
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Create the main Order record
      const [orderResult] = await conn.execute(
        'INSERT INTO Orders (customer_id, total_amount, shipping_address, status) VALUES (?, ?, ?, "paid")',
        [customer_id, total_amount, shipping_address]
      );
      const orderId = orderResult.insertId;

      // 2. Process each item in the order
      for (let item of items) {
        // A. Check stock availability in the Main Warehouse (ID 1)
        const [stock] = await conn.execute(
          'SELECT quantity FROM Stock WHERE product_id = ? AND warehouse_id = 1',
          [item.product_id]
        );

        if (!stock[0] || stock[0].quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.product_id}`);
        }

        // B. Deduct Stock
        await conn.execute(
          'UPDATE Stock SET quantity = quantity - ? WHERE product_id = ? AND warehouse_id = 1',
          [item.quantity, item.product_id]
        );

        // C. Add to Order_Items
        await conn.execute(
          'INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      await conn.commit();
      return orderId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};

module.exports = Order;