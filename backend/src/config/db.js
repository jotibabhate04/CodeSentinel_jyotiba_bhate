const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'codesentinel_db',
  port: Number.parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  dateStrings: true
};

const pool = mysql.createPool(dbConfig);

// Verification and table auto-creation fallback if database exists
const initializeDatabase = async () => {
  let connection;
  try {
    try {
      // Connect directly to target database first (works with least-privilege DB users)
      connection = await pool.getConnection();
    } catch (connError) {
      if (connError.code === 'ER_BAD_DB_ERROR') {
        // Fallback for local setup when database has not been created yet
        const baseConfig = { ...dbConfig };
        delete baseConfig.database;

        const rootConnection = await mysql.createConnection(baseConfig);
        await rootConnection.query(
          `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        );
        await rootConnection.end();
        connection = await pool.getConnection();
      } else {
        throw connError;
      }
    }

    console.log(`[Database] Connected successfully to MySQL database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);

    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_users_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create tasks table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`tasks\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NULL,
        \`priority\` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
        \`status\` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
        \`due_date\` DATE NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`fk_tasks_user\` FOREIGN KEY (\`user_id\`) 
          REFERENCES \`users\` (\`id\`) 
          ON DELETE CASCADE 
          ON UPDATE CASCADE,
        INDEX \`idx_tasks_user_id\` (\`user_id\`),
        INDEX \`idx_tasks_status\` (\`status\`),
        INDEX \`idx_tasks_priority\` (\`priority\`),
        INDEX \`idx_tasks_due_date\` (\`due_date\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('[Database] Database tables verified and ready.');
  } catch (error) {
    console.error('[Database] Connection or Initialization Error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  pool,
  initializeDatabase,
  query: (sql, params) => pool.execute(sql, params)
};
