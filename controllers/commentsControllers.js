const { checkExists } = require('../models/checkExists')
const { selectComments, insertComment} = require('../models/commentsModels')

exports.getComments = (req, res, next) => {
  const { review_id } = req.params
  return selectComments(review_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err))
}

exports.postComment = (req, res, next) => {
  const {review_id} = req.params
  const insertCommentPromise = insertComment(req.body, review_id)
  const checkReviewExistsPromise = checkExists('reviews', 'review_id', review_id)
  return Promise.all([insertCommentPromise, checkReviewExistsPromise])
  .then(([comment ])=> res.status(201).send({comment}))
  .catch(err => next(err))
}
