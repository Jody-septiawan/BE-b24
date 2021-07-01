const express = require('express')

const router = express.Router()

// Controller
const { register, login } = require('../controller/auth')
const { users, myProfile, updateUser } = require('../controller/user')

// Middleware
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')

// Endpoint

// Auth
router.post('/register', register)
router.post('/login', login)

// User
router.get('/users', auth, users)
router.get('/my-profile', auth, myProfile)
router.patch('/user', auth, uploadFile("imageFile"), updateUser)



module.exports = router