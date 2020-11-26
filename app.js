const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8080

// Load Env
dotenv.config({ path: './config.env' })

// morgan
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// multer diskStorage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images')
	},
	filename: function (req, file, cb) {
		cb(null, uuidv4() +'-'+file.originalname)
	}
})

// multer fileFilter
function fileFilter(req, file, cb) {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
		cb(null, true)
	}else{
		cb(null, false)
	}
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images', express.static(path.join(__dirname,'images')))
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'))

// routes
app.use('/blog', require('./routes/blog'))
app.use('/auth', require('./routes/auth'))

app.use((error,req,res,next)=>{
	const status = error.statusCode || 500
	const message = error.message
	const errorsArray = error.errorsArray || null
	res.status(status).json({
		message: message,
		errors: errorsArray
	})
})

// Handle production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static(__dirname + '/public/'))

//   // Handle SPA
//   app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
// }
// connect mongoDB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then(result => {
	app.listen(port)
}).catch(err => {
	console.log(err)
})

