const express = require('express');
const router = express.Router();
const {
  getProjects,
  setProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, getProjects).post(protect, admin, setProject);
router.route('/:id').put(protect, admin, updateProject).delete(protect, admin, deleteProject);

module.exports = router;
