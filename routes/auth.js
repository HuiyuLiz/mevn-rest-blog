const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth')
const User = require('../models/user')
const { body, validationResult } = require('express-validator')

router.put('/signup',[
	body('email')
		.isEmail()
		.withMessage('Please enter a valid E-mail.')
		.custom((value,{ req })=>{
			return User.findOne({email:value})
				.then(userDoc=>{
					if (userDoc){
						return Promise.reject('Email already exists!')
					}
				})
		})
		.normalizeEmail(),
	body('password').trim().isLength({ min: 8 }),
	body('name').trim().notEmpty()
], authControllers.singUp)


router.post('/login', authControllers.login)

module.exports = router