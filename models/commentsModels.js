const db = require('../db/connection.js')
const { selectReview } = require('./reviewsModel.js')

exports.selectComments = (reviewId) => {
    return selectReview(reviewId)
    .then(() => {
    return db.query(
        `SELECT * FROM comments
         WHERE review_id = $1
         ORDER BY created_at DESC`, [reviewId]
    )}).then((res) => {
        return res.rows
    })
}