const express = require('express');
const router = express.Router();
const ReportController = require('../controller/ReportController');

router.get('/report', ReportController.getProductReport);
router.get('/city', ReportController.getCityList)

module.exports = router;