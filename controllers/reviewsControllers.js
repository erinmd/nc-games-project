const {selectReviews, selectReview} = require('../models/reviewsModel')

exports.getReviews = (req, res, next) => {
    const {category, sort_by} = req.query
    return selectReviews(category, sort_by)
        .then(reviews => res.status(200).send({reviews}))
        .catch(err => next(err))
}

exports.getReview = (req, res, next) => {
    const {review_id} = req.params
    return selectReview(review_id)
        .then(review => res.status(200).send({review}))
        .catch(err => next(err))
}

