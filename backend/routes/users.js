const express = require('express');
const router = require('express').Router();
const { getUsers, getUserById, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.patch('/:userId', updateUser);

router.patch('/:userId/avatar', updateAvatar);

module.exports = router;