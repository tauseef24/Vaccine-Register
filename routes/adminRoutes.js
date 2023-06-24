// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.post('/add-centre', adminController.addVaccinationCentre);
router.get('/dosage-details', adminController.getDosageDetails);
router.delete('/remove-centre/:id', adminController.removeVaccinationCentre);

module.exports = router;
