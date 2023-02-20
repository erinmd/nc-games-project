const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const {getReviews, getReview, patchReview} = require('./controllers/reviewsControllers')
const { handle500Error, handleCustomError, handlePsqlError } = require('./controllers/error-handlers')
const {getComments, postComment} = require('./controllers/commentsControllers.js')

const app = express()
app.use(express.json());

app.use(express.json());

app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews', getReviews )
app.get('/api/reviews/:review_id/comments', getComments)
app.patch('/api/reviews/:review_id', patchReview)

app.post('/api/reviews/:review_id/comments', postComment)

app.use(handleCustomError)
app.use(handlePsqlError)
app.use(handle500Error)

module.exports = app;