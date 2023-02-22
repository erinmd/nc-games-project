const { deleteComment } = require('../controllers/commentsControllers')

const commentRouter = require('express').Router()

commentRouter.delete('/:comment_id', deleteComment)

module.exports = commentRouter