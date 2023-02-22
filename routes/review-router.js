const { getComments, postComment } = require('../controllers/commentsControllers')
const { getReviews, getReview, patchReview, postReview } = require('../controllers/reviewsControllers')

const reviewRouter = require('express').Router()

reviewRouter.route('/')
            .get(getReviews)
            .post(postReview)
reviewRouter.route('/:review_id')
            .get(getReview)
            .patch(patchReview)
reviewRouter.route('/:review_id/comments')
            .get(getComments)
            .post(postComment)

            
module.exports = reviewRouter