const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')


function singUp(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new Error('Validation Failed.')
		error.statusCode = 422
		error.errorsArray = errors.array()
		throw error
	}
	const { name, email,password} = req.body
	bcryptjs.hash(password,12)
		.then(hashPassword=>{
			const user = new User({
				name:name,
				email: email,
				password: hashPassword
			})
			return user.save()
		})
		.then(result=>{
			res.status(201).json({
				message: 'User created.',
				userId:result._id
			})
		})
		.catch(error=>{
			if (!error.statusCode) {
				error.statusCode = 500
			}
			next(error)
		})
	
}



module.exports = {
	singUp
}
