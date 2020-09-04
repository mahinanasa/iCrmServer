const express = require('express');
const router = express.Router();
const { createStaff, getStaffs, updateStaffs, deleteStaff } = require('../controllers/staffController');
const { createLead, getLeads, updateLead, deleteLead } = require('../controllers/leadController');

//Staff Routes
router.post('/createStaff', createStaff);
router.get('/getStaffs', getStaffs);
router.put('/updateStaff', updateStaffs);
router.delete('/deleteStaff', deleteStaff);

//Lead Routes
router.post('/createLead', createLead);
router.get('/getLeads', getLeads);
router.put('/updateLead', updateLead);
router.delete('/deleteLead', deleteLead);

module.exports = router;