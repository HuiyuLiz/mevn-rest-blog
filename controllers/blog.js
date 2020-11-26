const fs = require('fs')
const path = require('path')
const Post = require('../models/post')
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

function deletePost(req, res, next) {
	const postId = req.params.postId
	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('Could not find post.')
				error.statusCode = 404
				throw error
			}
			clearImage(post.imageUrl)
			return Post.findByIdAndRemove(post._id)
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

	const { title, content } = req.body
	const imageUrl = req.file.path.replace('\\', '/')
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: {
			name: 'Li'
		},
	})
	post.save()
		.then(response => {
			res.status(201).json({
				message: 'Post created successfully.',
				post: response
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

	Post.findById(postId)
		.then(post => {
			if(!post){
				const error = new Error('Could not find post.')
				error.statusCode = 404
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
		.then(result=>{
			res.status(200).json({
				message: 'Post Updated.',
				post: result
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
