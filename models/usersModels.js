const db = require('../db/connection.js')

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => rows)
}

exports.selectUser = username => {
  return db
    .query(
      `SELECT * FROM users
         WHERE username = $1`,
      [username]
    )
    .then(result => {
      if (!result.rowCount) {
        return Promise.reject({ status: 404, msg: `User not found` })
      }
      return result.rows[0]
    })
}

exports.selectUserVotes = username => {
  return db
    .query(
      `SELECT * FROM uservotes
         WHERE username = $1`,
      [username]
    )
    .then(result => {
      const data = result.rows
      const likes = data
        .filter(info => info.vote === 1)
        .map(info => info.review_id)
      const dislikes = data
        .filter(info => info.vote === -1)
        .map(info => info.review_id)

      return { likes, dislikes }
    })
}
