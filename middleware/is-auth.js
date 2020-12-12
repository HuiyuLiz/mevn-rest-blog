const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Load Env
dotenv.config({ path: '../config/config.env' })

module.exports = (req,res,next)=> {
	const header = req.get('Authorization')
	if(!header){
		const error = new Error('No authenticated.')
		error.statusCode = 401
		throw error
	}
	const token = header.split(' ')[1]
	const secret = process.env.JWT_SECRET
  
	let decodeToken

	try {
		decodeToken = jwt.verify(token, secret)    
	} catch (error) {
		error.statusCode = 500
		throw error    
	}
  
	if (!decodeToken) {
		const error = new Error('No authenticated.')
		error.statusCode = 401
		throw error
	}
	req.userId = decodeToken.userId
	next()

}