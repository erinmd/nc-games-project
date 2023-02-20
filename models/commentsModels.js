const db = require('../db/connection.js')

exports.selectComments = (reviewId) => {
    return db.query(
        `SELECT * FROM comments
         WHERE review_id = $1
         ORDER BY created_at DESC`, [reviewId]
    ).then((res) => {
        if (!res.rowCount) return Promise.reject({status: 404, msg: "No comments found"})
        return res.rows
    })
}