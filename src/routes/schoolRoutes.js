const express = require('express');
const router = express.Router();

const { addSchool, listSchools } = require('../controllers/schoolController');
const { addSchoolValidators, listSchoolsValidators } = require('../middleware/validation');

router.post('/addSchool', addSchoolValidators, addSchool);
router.get('/listSchools', listSchoolsValidators, listSchools);

module.exports = router;  // ✅ MUST be this