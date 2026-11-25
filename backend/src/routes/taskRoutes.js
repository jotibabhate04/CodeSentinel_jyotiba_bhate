const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
  taskIdParamValidator
} = require('../validators/taskValidator');

// Protect all task routes with JWT authentication
router.use(authenticateToken);

// Task collection routes
router.get('/', taskController.getTasks);
router.post('/', createTaskValidator, validate, taskController.createTask);
router.get('/stats', taskController.getTaskStats);

// Single task routes
router.get('/:id', taskIdParamValidator, validate, taskController.getTaskById);
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);
router.patch('/:id/status', updateStatusValidator, validate, taskController.updateTaskStatus);
router.delete('/:id', taskIdParamValidator, validate, taskController.deleteTask);

module.exports = router;
