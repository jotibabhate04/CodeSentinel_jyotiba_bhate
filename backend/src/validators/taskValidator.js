const { body, param } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Due date must be in YYYY-MM-DD format')
];

const updateTaskValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('priority')
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Due date must be in YYYY-MM-DD format')
];

const updateStatusValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'completed']).withMessage('Status must be pending or completed')
];

const taskIdParamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Task ID must be a positive integer')
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
  taskIdParamValidator
};
