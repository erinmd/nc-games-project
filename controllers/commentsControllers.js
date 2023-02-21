const { checkExists } = require('../models/checkExists')
const { selectComments, insertComment, removeComment} = require('../models/commentsModels')

exports.getComments = (req, res, next) => {
  const { review_id } = req.params
  return selectComments(review_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err))
}

exports.postComment = (req, res, next) => {
  const {review_id} = req.params
  return insertComment(req.body, review_id)
  .then((comment )=> res.status(201).send({comment}))
  .catch(err => next(err))
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params
  const removeCommentPromise = removeComment(comment_id)
  const checkCommentExistsPromise = checkExists('comments', 'comment_id', comment_id)
  return Promise.all([removeCommentPromise, checkCommentExistsPromise])
  .then(() => res.status(204).send())
  .catch(err => next(err))
}