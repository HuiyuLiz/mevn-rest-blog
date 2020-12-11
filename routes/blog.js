const express = require('express')
const router = express.Router()
const blogControllers = require('../controllers/blog')
const isAuth=require('../middleware/is-auth')
const { body, validationResult } = require('express-validator')

// Get Posts
router.get('/posts', blogControllers.getPosts)

// Get Single Post
router.get('/posts/:postId', blogControllers.getPost)

// delete Single Post
router.delete('/posts/:postId', isAuth, blogControllers.deletePost)

// Post Post
router.post('/posts', isAuth, [body('title').trim().isLength({ min: 1 }), body('content').notEmpty()], blogControllers.createPost)

// Update Single Post
router.put('/posts/:postId', isAuth,[body('title').trim().isLength({ min: 1 }), body('content').notEmpty()], blogControllers.updatePost)

module.exports = router
