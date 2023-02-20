const db = require('../db/connection.js')
exports.selectReviews = () => {
    return db.query(
        `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count
         FROM reviews
         LEFT JOIN comments ON reviews.review_id = comments.review_id
         GROUP BY owner, title, reviews.review_id, category, review_img_url,
         reviews.created_at, reviews.votes, designer
         ORDER BY created_at DESC`
    ).then(({rows})=> rows)
}