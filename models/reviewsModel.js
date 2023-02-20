const db = require('../db/connection.js')
exports.selectReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count
         FROM reviews
         LEFT JOIN comments ON reviews.review_id = comments.review_id
         GROUP BY owner, title, reviews.review_id, category, review_img_url,
         reviews.created_at, reviews.votes, designer
         ORDER BY created_at DESC`
    )
    .then(({ rows }) => rows)
}

exports.selectReview = reviewId => {
  return db
    .query(
      `SELECT * FROM reviews
         WHERE review_id = $1`,
      [reviewId]
    )
    .then(res => {
      if (!res.rowCount)
        return Promise.reject({ status: 404, msg: 'Review not found' })
      return res.rows[0]
    })
}

exports.updateReview = (reviewId, voteInc) => {
  return this.selectReview(reviewId)
    .then(() => {
      return db.query(
        `UPDATE reviews
         SET votes = votes + $1
         WHERE review_id = $2
         RETURNING *`,
        [voteInc, reviewId]
      )
    })
    .then(res => {
      return res.rows[0]
    })
}
