const asyncHandler = require('express-async-handler');
const { Task, User, Project } = require('../models');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const where = {};
  if (projectId) where.projectId = projectId;
  if (req.user.role !== 'Admin') where.assignedTo = req.user.id;

  const tasks = await Task.findAll({
    where,
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      { model: Project, attributes: ['id', 'title'] },
    ],
  });
  res.status(200).json(tasks);
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const setTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;
  if (!title || !description || !projectId || !dueDate) {
    res.status(400);
    throw new Error('Please add all required fields');
  }
  const task = await Task.create({ title, description, projectId, assignedTo, status, priority, dueDate });
  const created = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
  });
  res.status(201).json(created);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }
  await task.update(req.body);
  const updated = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
  });
  res.status(200).json(updated);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete task');
  }
  await task.destroy();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getTasks, setTask, updateTask, deleteTask };
