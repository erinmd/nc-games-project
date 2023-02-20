const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const {getReviews, getReview} = require('./controllers/reviewsControllers')
const { handle500Error, handleCustomError, handlePsqlError } = require('./controllers/error-handlers')
const { getUsers } = require('./controllers/usersControllers')
const {getComments, postComment} = require('./controllers/commentsControllers.js')

const app = express()
app.use(express.json());

app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews', getReviews )
app.get('/api/reviews/:review_id/comments', getComments)
app.get('/api/users', getUsers)

app.post('/api/reviews/:review_id/comments', postComment)

app.use(handleCustomError)
app.use(handlePsqlError)
app.use(handle500Error)

module.exports = app;