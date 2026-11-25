const db = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const sql = 'SELECT id, name, email, password, created_at FROM users WHERE email = ? LIMIT 1';
    const [rows] = await db.query(sql, [email.toLowerCase().trim()]);
    return rows[0] || null;
  }

  static async findById(id) {
    const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1';
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ name, email, password }) {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [
      name.trim(),
      email.toLowerCase().trim(),
      password
    ]);
    return {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim()
    };
  }
}

module.exports = UserModel;
