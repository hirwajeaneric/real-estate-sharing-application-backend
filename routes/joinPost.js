const express = require('express');
const router = express.Router();

const { findById, add, edit, findByPropertyId, findByExpectedActivities, findByOwnerId, findByPostingTenantId, getAll } = require('../controllers/joinPost');

router.post('/add', add);
router.get('/list', getAll);
router.get('/findById', findById);
router.get('/findByPropertyId', findByPropertyId);
router.get('/findByExpectedActivities', findByExpectedActivities);
router.get('/findByOwnerId', findByOwnerId);
router.get('/findByPostingTenantId', findByPostingTenantId);
router.put('/update', edit);

module.exports = router;