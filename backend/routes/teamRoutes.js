const express = require('express');
const router = express.Router();
const { getTeam, inviteMember } = require('../controllers/teamController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, getTeam);
router.route('/invite').post(protect, admin, inviteMember);

module.exports = router;
