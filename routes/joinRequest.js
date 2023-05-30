const express = require('express');
const router = express.Router();

const { findById, getAll, add, edit, findByJoinPost, findByPropertyId, remove } = require('../controllers/joinRequest');

router.post('/add', add);
router.get('/list', getAll);
router.get('/findById', findById);
router.get('/findByJoinPost', findByJoinPost);
router.get('/findByPropertyId', findByPropertyId);
router.put('/update', edit);
router.delete('/delete', remove);

module.exports = router;