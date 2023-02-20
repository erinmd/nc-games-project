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
  test('200: GET request responds with a review object', () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(({body: {review}}) => {
        expect(review).toEqual({
          review_id: 2,
          title: 'Jenga',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_img_url:
            'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
          review_body: 'Fiddly fun for all the family',
          category: 'dexterity',
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5
        })
      })
  })
  test('404: GET request with an id out of range returns "Not Found"', () => {
    return request(app)
      .get('/api/reviews/10000')
      .expect(404)
      .then(({body:{msg}}) => {
        expect(msg).toBe('Review not found')
      })
  })
  test('400: GET request with invalid id returns bad request', () => {
    return request(app)
      .get('/api/reviews/bananas')
      .expect(400)
      .then(({body:{msg}}) => {
        expect(msg).toBe('Bad request')
      })
  })
})
