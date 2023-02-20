const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const { handle500Error } = require('./controllers/error-handlers')


const app = express()

app.get('/api/categories', getCategories)

app.use(handle500Error)

module.exports = app;