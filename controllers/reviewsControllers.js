const { checkExists } = require('../models/checkExists')
const {
  selectReviews,
  selectReview,
  updateReview,
  insertReview,
  removeReview
} = require('../models/reviewsModel')

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order_by, limit, p } = req.query
  return selectReviews(category, sort_by, order_by, limit, p)
    .then(reviews => res.status(200).send({ reviews }))
    .catch(err => next(err))
}

exports.getReview = (req, res, next) => {
  const { review_id } = req.params
  return selectReview(review_id)
    .then(review => res.status(200).send({ review }))
    .catch(err => next(err))
}

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params
  const { inc_votes } = req.body
  const checkReviewIdPromise = checkExists('reviews', 'review_id', review_id)
  const updateReviewPromise = updateReview(review_id, inc_votes)
  return Promise.all([updateReviewPromise, checkReviewIdPromise])
    .then(([review]) => res.status(200).send({ review }))
    .catch(err => next(err))
}

exports.postReview = (req, res, next) => {
  return insertReview(req.body)
    .then(res => {
      return selectReview(res.review_id)
    })
    .then(review => res.status(201).send({ review }))
    .catch(err => next(err))
}

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params
  const checkReviewExistsPromise = checkExists(
    'reviews',
    'review_id',
    review_id
  )
  const deleteReviewPromise = removeReview(review_id)
  return Promise.all([checkReviewExistsPromise, deleteReviewPromise])
    .then(() => res.status(204).send())
    .catch(err => next(err))
}
