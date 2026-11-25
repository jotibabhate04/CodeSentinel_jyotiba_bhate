-- CodeSentinel Database Initialization Script
-- MySQL 8.x compatible

CREATE DATABASE IF NOT EXISTS `codesentinel_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `codesentinel_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks Table
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    `status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
    `due_date` DATE NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    INDEX `idx_tasks_user_id` (`user_id`),
    INDEX `idx_tasks_status` (`status`),
    INDEX `idx_tasks_priority` (`priority`),
    INDEX `idx_tasks_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
