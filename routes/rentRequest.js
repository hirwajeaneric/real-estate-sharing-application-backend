const express = require('express');
const router = express.Router();

const { findById, add, remove, findByPropertyId, edit, getAll } = require('../controllers/rentRequest');

router.post('/add', add);
router.get('/list', getAll);
router.get('/findById', findById);
router.get('/findByPropertyId', findByPropertyId);
router.put('/update', edit);
router.delete('/delete', remove);

module.exports = router;