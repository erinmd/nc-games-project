const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const {getReviews} = require('./controllers/reviewsControllers')
const { handle500Error } = require('./controllers/error-handlers')


const app = express()

app.get('/api/categories', getCategories)
// app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews', getReviews )

app.use(handle500Error)

module.exports = app;