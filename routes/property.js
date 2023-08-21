const express = require('express');
const router = express.Router();

const { findById, getAll, add, attachFile, edit, findByLocation, findByMapCoordinates, findByOwnerId, findByPostId, editLatest, findByStatus, remove, upload, deleteUnpaid } = require('../controllers/property');


router.post('/add', upload.array('pictures', 12), attachFile, add);
router.get('/list', getAll);
router.get('/findById', findById);
router.put('/update', upload.array('pictures', 12), attachFile, edit);
router.post('/updateLatest', editLatest);
router.delete('/delete', remove);
router.delete('/deleteUnpaid', deleteUnpaid);
router.get('/findByLocation', findByLocation);
router.get('/findByMapCoordinates', findByMapCoordinates);
router.get('/findByOwnerId', findByOwnerId);
router.get('/findByPostId', findByPostId);
router.get('/findByStatus', findByStatus);

module.exports = router;