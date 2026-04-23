const db = require('../config/db');

const Product = {
  // Create a new product
  create: async (productData) => {
    const { sku, name, description, price, category_id, seller_id, image_url } = productData;
    const [result] = await db.execute(
      'INSERT INTO Products (sku, name, description, price, category_id, seller_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sku, name, description, price, category_id, seller_id, image_url]
    );
    return result.insertId;
  },

  // Get all products with their total stock count
  findAll: async () => {
    const query = `
      SELECT p.*, SUM(s.quantity) as total_stock 
      FROM Products p 
      LEFT JOIN Stock s ON p.id = s.product_id 
      GROUP BY p.id
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  // Update stock level in a specific warehouse
  updateStock: async (productId, warehouseId, quantity) => {
    const query = `
      INSERT INTO Stock (product_id, warehouse_id, quantity) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;
    const [result] = await db.execute(query, [productId, warehouseId, quantity]);
    return result;
  }
};

module.exports = Product;