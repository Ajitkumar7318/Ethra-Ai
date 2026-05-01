const asyncHandler = require('express-async-handler');
const { User } = require('../models');

// @desc    Get all team members
// @route   GET /api/team
// @access  Private
const getTeam = asyncHandler(async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.status(200).json(users);
});

// @desc    Invite (create) a team member
// @route   POST /api/team/invite
// @access  Private/Admin
const inviteMember = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, role: role || 'Member' });
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

module.exports = { getTeam, inviteMember };
