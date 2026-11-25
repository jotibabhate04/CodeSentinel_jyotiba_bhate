const TaskModel = require('../models/taskModel');

// @desc    Get all tasks for logged-in user (with search & filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, status, priority } = req.query;

    const tasks = await TaskModel.findAllByUserId(userId, { search, status, priority });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await TaskModel.getStatsByUserId(userId);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await TaskModel.findByIdAndUserId(taskId, userId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to view this task.'
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, status, dueDate } = req.body;

    const newTask = await TaskModel.create({
      userId,
      title,
      description,
      priority,
      status,
      dueDate
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, priority, status, dueDate } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await TaskModel.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to update this task.'
      });
    }

    const updatedTask = await TaskModel.update(taskId, userId, {
      title,
      description,
      priority,
      status,
      dueDate
    });

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (mark pending / completed)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { status } = req.body;

    // Check authorization & existence
    const existingTask = await TaskModel.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to update this task.'
      });
    }

    const updatedTask = await TaskModel.updateStatus(taskId, userId, status);

    return res.status(200).json({
      success: true,
      message: `Task marked as ${status}.`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // Check authorization & existence
    const existingTask = await TaskModel.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to delete this task.'
      });
    }

    await TaskModel.delete(taskId, userId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
