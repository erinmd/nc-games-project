const db = require('../db/connection.js')
exports.selectReviews = (category, sort_by = 'created_at') => {
    let queryString = `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    `
    const queryParams = []

    if (category) {
        queryString += " WHERE reviews.category = $1"
        queryParams.push(category)
    }

    const validSortBys = ['owner', 'title', 'review_id', 'category', 'review_img_url',
                           'created_at', 'votes', 'designer']
    if (!validSortBys.includes(sort_by)) sort_by = 'created_at'

    queryString += ` GROUP BY owner, title, reviews.review_id, category, review_img_url,
    reviews.created_at, reviews.votes, designer 
    ORDER BY ${sort_by} DESC`

    return db.query(queryString, queryParams      
    ).then(({rows})=> rows)
}

exports.selectReview = (reviewId) => {
    return db.query(
        `SELECT * FROM reviews
         WHERE review_id = $1`, [reviewId]
    ).then((res) => {
        if (!res.rowCount) return Promise.reject({status: 404, msg: "Review not found"})
        return res.rows[0]})
}


