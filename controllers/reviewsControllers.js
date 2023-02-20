const {selectReviews, selectReview, updateReview} = require('../models/reviewsModel')

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

exports.patchReview = (req, res, next) => {
    const {review_id} = req.params
    const {inc_votes} = req.body
    return updateReview(review_id, inc_votes)
        .then(review => res.status(201).send({review}))
        .catch(err => next(err))
}