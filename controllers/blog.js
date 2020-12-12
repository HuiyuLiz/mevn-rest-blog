const fs = require('fs')
const path = require('path')
const Post = require('../models/post')
const User = require('../models/user')
const { validationResult } = require('express-validator')

function getPost(req, res, next) {
	const ObjectId = require('mongoose').Types.ObjectId
	const postId = req.params.postId
	if (!ObjectId.isValid(postId)) {
		const error = new Error('Could not find post.')
		error.statusCode = 404
		throw error
	} else {
		Post.findById(postId)
			.populate('creator', 'name _id')
			.then(post => {
				res.status(200).json({
					message: 'Post fetched.',
					post: post
				})
			})
			.catch(error => {
				if (!error.statusCode) {
					error.statusCode = 500
					error.message = 'Oops, Something went wrong.'
				}
				next(error)
			})
	}
}


function getPosts(req, res, next) {
	const currentPage = req.query.page ||1
	const perPageItem = 5
	let totalItem
	Post
		.find()
		.countDocuments()
		.then(total => {
			totalItem = total
			return Post.find()
				.populate('creator', 'name _id')
				.skip((currentPage - 1) * perPageItem)
				.limit(perPageItem)
		})
		.then(posts => {
			if (!posts) {
				const error = new Error('Could not find posts.')
				error.statusCode = 404
				throw error
			}
			res.status(200).json({
				message: 'Fetched posts successfully.',
				posts: posts,
				totalItem: totalItem
			})
		})			
		.catch(error => {
			if (!error.statusCode) {
				error.statusCode = 500
			}
			next(error)
		})
}

function createPost(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new Error('Validation Failed.')
		error.statusCode = 422
		error.errorsArray = errors.array()
		throw error
	}
	if (!req.file) {
		const error = new Error('No image provided.')
		error.statusCode = 422
		throw error
	}

	let creator
	const { title, content } = req.body
	const imageUrl = req.file.path.replace('\\', '/')
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	})
	post
		.save()
		.then(result => {
			return User.findById(req.userId)
		})
		.then(user=>{
			creator = user
			user.posts.push(post)
			return user.save()
		})
		.then(result=>{
			res.status(201).json({
				message: 'Post created successfully.',
				post: post,
				creator: { _id: creator._id, name: creator.name}
			})
		})
		.catch(error => {
			if (!error.statusCode){
				error.statusCode = 500
			}
			next(error)
		})
}

function updatePost(req, res, next) {
	const postId = req.params.postId
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new Error('Validation Failed.')
		error.statusCode = 422
		error.errorsArray = errors.array()
		throw error
	}
	const { title, content} = req.body
	let  imageUrl  = req.body.image
	if(req.file){
		imageUrl= req.file.path.replace('\\', '/')
	}
	if (!imageUrl) {
		const error = new Error('No image provided.')
		error.statusCode = 422
		throw error
	}

	let updatePost
	Post.findById(postId)
		.then(post => {
			if(!post){
				const error = new Error('Could not find post.')
				error.statusCode = 404
				throw error
			}

			if (post.creator.toString() !== req.userId) {
				const error = new Error('No authorized.')
				error.statusCode = 403
				throw error
			}

			if(imageUrl !== post.imageUrl){
				clearImage(post.imageUrl)
			}
			post.title=title
			post.content=content
			post.imageUrl=imageUrl
			return post.save()
		})
		.then(result => {
			updatePost = result
			return User.findById(req.userId)
		})
		.then(user => {
			res.status(200).json({
				message: 'Post Updated.',
				post: updatePost,
				creator: { _id: user._id, name: user.name }
			})
		})
		.catch(error => {
			if (!error.statusCode) {
				error.statusCode = 500
				error.message = 'Oops, Something went wrong.'
			}
			next(error)
		})

}

function deletePost(req, res, next) {
	const postId = req.params.postId
	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('Could not find post.')
				error.statusCode = 404
				throw error
			}

			if (post.creator.toString() !== req.userId) {
				const error = new Error('No authorized.')
				error.statusCode = 403
				throw error
			}

			clearImage(post.imageUrl)
			return Post.findByIdAndRemove(postId)
		})
		.then(result => {
			return User.findById(req.userId)
		})
		.then(user => {
			user.posts.pull(postId)
			return user.save()
		})
		.then(result => {
			res.status(200).json({
				message: 'Deleted post.'
			})
		})
		.catch(error => {
			if (!error.statusCode) {
				error.statusCode = 500
				error.message = 'Oops, Something went wrong.'
			}
			next(error)
		})
}

function clearImage(filePath) {
	filePath = path.join(__dirname, '..', filePath)
	fs.unlink(filePath,error=>console.log(error))	
}

module.exports = {
	getPost,
	getPosts,
	createPost,
	updatePost,
	deletePost
}
