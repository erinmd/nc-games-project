const db = require('../db/connection.js')
const request = require('supertest')
const app = require('../app.js')
const {
  categoryData,
  commentData,
  reviewData,
  userData
} = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData })
})
afterAll(() => {
  return db.end()
})

describe('api', () => {
  test('200: GET request responds with array of category objects', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array)
        expect(categories).toHaveLength(4)
        categories.forEach(category => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
          })
        })
      })
  })
  test('200: GET request responds with array of review objects', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({body:{reviews}}) => {
        expect(reviews).toBeInstanceOf(Array)
        expect(reviews).toHaveLength(13)
        reviews.forEach(review => expect(review).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          comment_count: expect.any(Number),
        })
      )
      expect(reviews).toBeSortedBy('created_at', {descending: true} )
      })
  })
})
