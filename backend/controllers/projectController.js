const asyncHandler = require('express-async-handler');
const { Project, User, Task } = require('../models');

// @desc    Get projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
    });
  } else {
    projects = await Project.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
      where: { createdBy: req.user.id },
    });
  }
  res.status(200).json(projects);
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const setProject = asyncHandler(async (req, res) => {
  const { title, description, deadline, teamMembers } = req.body;
  if (!title || !description || !deadline) {
    res.status(400);
    throw new Error('Please add title, description, and deadline');
  }

  const project = await Project.create({ title, description, deadline, createdBy: req.user.id });

  if (teamMembers && teamMembers.length > 0) {
    await project.setMembers(teamMembers);
  }

  const created = await Project.findByPk(project.id, {
    include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }],
  });

  res.status(201).json(created);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (req.user.role !== 'Admin' && project.createdBy !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update project');
  }
  await project.update(req.body);
  res.status(200).json(project);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete project');
  }
  await project.destroy();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getProjects, setProject, updateProject, deleteProject };
