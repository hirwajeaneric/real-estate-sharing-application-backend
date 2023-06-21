const express = require('express');
const router = express.Router();

const user = require('./user');
const contract = require('./contract');
const property = require('./property');
const joinPost = require('./joinPost');
const rentRequest = require('./rentRequest');
const joinRequest = require('./joinRequest');
const emailRoutes = require('./email');

router.use('/profile', express.static('./profiles'));
router.use('/property', express.static('./properties'));

router.use('/email', emailRoutes);
router.use('/user', user);
router.use('/contract', contract);
router.use('/property', property);
router.use('/joinPost', joinPost);
router.use('/joinRequest', joinRequest);
router.use('/rentRequest', rentRequest);

module.exports = router;