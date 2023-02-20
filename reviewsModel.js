exports.selectReviews = () => {
    return db.query(
        `SELECT owner, title, reviews.review_id, category, review_img_url
                created_at, votes, designer, COUNT(comment_id) AS comment_count
         FROM reviews
         JOIN comments ON reviews.review_id = comments.review_id
         GROUP BY owner, title, reviews.review_id, category, review_img_url
         created_at, votes, designer
         ORDER BY created_at DESC`
    )
}