const express = require('express');
const router = express.Router();
const { listarSedes } = require('../controllers/sede');

router.get('/', listarSedes);

module.exports = router;
