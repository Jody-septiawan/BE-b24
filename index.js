require('dotenv').config()
const express = require('express')
const router = require('./src/routers')

const app = express()

const port = 5000

app.use(express.json())

app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))

app.listen(port, () => console.log(`Your server running on port ${port}`))