const db = require('../config/db');

class TaskModel {
  static async findAllByUserId(userId, filters = {}) {
    let sql = `
      SELECT id, user_id, title, description, priority, status, 
             DATE_FORMAT(due_date, '%Y-%m-%d') as due_date, 
             created_at, updated_at
      FROM tasks 
      WHERE user_id = ?
    `;
    const params = [userId];

    if (filters.search && filters.search.trim()) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.status && filters.status !== 'all') {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }

    // Default order by created_at DESC or due_date
    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findByIdAndUserId(id, userId) {
    const sql = `
      SELECT id, user_id, title, description, priority, status, 
             DATE_FORMAT(due_date, '%Y-%m-%d') as due_date, 
             created_at, updated_at 
      FROM tasks 
      WHERE id = ? AND user_id = ? 
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [id, userId]);
    return rows[0] || null;
  }

  static async create({ userId, title, description, priority = 'Medium', status = 'pending', dueDate = null }) {
    const sql = `
      INSERT INTO tasks (user_id, title, description, priority, status, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      userId,
      title.trim(),
      description ? description.trim() : null,
      priority,
      status,
      dueDate || null
    ]);

    return this.findByIdAndUserId(result.insertId, userId);
  }

  static async update(id, userId, { title, description, priority, status, dueDate }) {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) {
      return null;
    }

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDescription = description !== undefined ? (description ? description.trim() : null) : existing.description;
    const newPriority = priority !== undefined ? priority : existing.priority;
    const newStatus = status !== undefined ? status : existing.status;
    const newDueDate = dueDate !== undefined ? (dueDate || null) : existing.due_date;

    const sql = `
      UPDATE tasks 
      SET title = ?, description = ?, priority = ?, status = ?, due_date = ?
      WHERE id = ? AND user_id = ?
    `;
    await db.query(sql, [
      newTitle,
      newDescription,
      newPriority,
      newStatus,
      newDueDate,
      id,
      userId
    ]);

    return this.findByIdAndUserId(id, userId);
  }

  static async updateStatus(id, userId, status) {
    const sql = `
      UPDATE tasks 
      SET status = ?
      WHERE id = ? AND user_id = ?
    `;
    const [result] = await db.query(sql, [status, id, userId]);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findByIdAndUserId(id, userId);
  }

  static async delete(id, userId) {
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    const [result] = await db.query(sql, [id, userId]);
    return result.affectedRows > 0;
  }

  static async getStatsByUserId(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
        SUM(CASE WHEN priority = 'High' AND status != 'completed' THEN 1 ELSE 0 END) as high_priority_tasks
      FROM tasks 
      WHERE user_id = ?
    `;
    const [rows] = await db.query(sql, [userId]);
    const row = rows[0] || {};
    return {
      total: Number(row.total_tasks) || 0,
      completed: Number(row.completed_tasks) || 0,
      pending: Number(row.pending_tasks) || 0,
      highPriority: Number(row.high_priority_tasks) || 0
    };
  }
}

module.exports = TaskModel;
