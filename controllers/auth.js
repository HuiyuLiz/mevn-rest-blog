const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { validationResult } = require('express-validator')

// Load Env
dotenv.config({ path: '../config.env' })

function singUp(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new Error('Validation Failed.')
		error.statusCode = 422
		error.errorsArray = errors.array()
		throw error
	}
	const { name, email,password} = req.body
	bcrypt.hash(password,12)
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
				message: 'User created, please log in.',
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

function login(req, res, next){
	const { email,password } = req.body
	const secret = process.env.JWT_SECRET
		
	let storeUserData
	User.findOne({email:email})
		.then(user=>{
			if(!user){
				const error = new Error('User not found.')
				error.statusCode = 401
				throw error
			}
			storeUserData = user
			return bcrypt.compare(password, user.password)
		})
		.then(isEqual=>{
			if (!isEqual) {
				const error = new Error('Wrong password.')
				error.statusCode = 401
				throw error
			}
			const token =jwt.sign({
				email: storeUserData.email,
				userId: storeUserData._id.toString()
			}, secret, { expiresIn: '1h' }) 			
			res.status(200).json({
				message:'User login successfully.',
				token: token,
				userId: storeUserData._id.toString()
			})	
			console.log(token)		
		})
		.catch(error=>{
			if (!error.statusCode) {
				error.statusCode = 500
			}
			next(error)
		})

}

module.exports = {
	singUp,
	login
}
