const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const {getReviews, getReview} = require('./controllers/reviewsControllers')
const { handle500Error, handleCustomError, handlePsqlError } = require('./controllers/error-handlers')
const {getComments} = require('./controllers/commentsControllers.js')
const { getUsers } = require('./controllers/usersControllers')

const app = express()

app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews', getReviews )
app.get('/api/reviews/:review_id/comments', getComments)
app.get('/api/users', getUsers)

app.use(handleCustomError)
app.use(handlePsqlError)
app.use(handle500Error)

module.exports = app;