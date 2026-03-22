const express = require('express');
const contactController = require('./contact.controller');

const router = express.Router();

// POST /api/v1/contact
router.post('/', contactController.createContact);

module.exports = router;
