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

exports.insertComment = (newComment, reviewId) => {
    let {username, body, votes, created_at} = newComment
    if (!votes) votes = 0
    if (!created_at) created_at = 'NOW()'

    return selectReview(reviewId)
    .then(() => {
    return db.query(
        `INSERT INTO comments
        (body, author, review_id, votes, created_at)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *;`, [body, username, reviewId, votes, created_at]
    )}).then(res => {
        return res.rows[0]
    })
}