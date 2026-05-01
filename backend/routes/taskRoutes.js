const express = require('express');
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, getTasks).post(protect, admin, setTask);
router.route('/:id').put(protect, updateTask).delete(protect, admin, deleteTask);

module.exports = router;
