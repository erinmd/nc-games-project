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
})
