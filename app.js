const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const { getUsers } = require('./controllers/usersControllers')
const {getReviews, getReview, patchReview} = require('./controllers/reviewsControllers')
const { handle500Error, handleCustomError, handlePsqlError, handle404PathError } = require('./controllers/error-handlers')
const {getComments, postComment, deleteComment} = require('./controllers/commentsControllers.js')

const apiRouter = require('./routes/api-router.js')
const app = express()

//app.use(express.json());
app.use('/api', apiRouter)

// app.get('/api/categories', getCategories)
// app.get('/api/reviews/:review_id', getReview)
// app.get('/api/reviews', getReviews )
// app.get('/api/reviews/:review_id/comments', getComments)
// app.get('/api/users', getUsers)
// app.patch('/api/reviews/:review_id', patchReview)
// app.post('/api/reviews/:review_id/comments', postComment)
// app.delete('/api/comments/:comment_id', deleteComment)
// app.get('/api', getEndpoints)

// app.use(handle404PathError)
// app.use(handleCustomError)
// app.use(handlePsqlError)
// app.use(handle500Error)

module.exports = app;