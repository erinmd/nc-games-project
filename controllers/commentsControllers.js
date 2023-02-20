const { selectComments, insertComment} = require('../models/commentsModels')

exports.getComments = (req, res, next) => {
  const { review_id } = req.params
  return selectComments(review_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err))
}

exports.postComment = (req, res, next) => {
  const {review_id} = req.params
  return insertComment(req.body, review_id)
  .then(comment => res.status(201).send({comment}))
  .catch(err => next(err))
}