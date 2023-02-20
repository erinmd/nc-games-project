const { insertComment } = require('../models/reviewsModel')
const {selectReviews, selectReview} = require('../models/reviewsModel')

exports.getReviews = (req, res, next) => {
    return selectReviews()
        .then(reviews => res.status(200).send({reviews}))
        .catch(err => next(err))
}

exports.getReview = (req, res, next) => {
    const {review_id} = req.params
    return selectReview(review_id)
        .then(review => res.status(200).send({review}))
        .catch(err => next(err))
}

exports.postComment = (req, res, next) => {
    const {review_id} = req.params
    return insertComment(req.body, review_id)
    .then(comment => res.status(201).send({comment}))
    .catch(err => next(err))
}