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

describe('app', () => {

  
  describe('Valid but non-existent path', () => {
    test('404: any non-existent path request responds with Path not found', () => {
      return request(app)
        .get('/api/path_that_doesnt_exist')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Path not found')
        })
    })
  })

  describe.only('api', () => {
    test('200: GET request responds with JSON describing all endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({body:{endpoints}}) => {
          endpointsObject = JSON.parse(endpoints)
          expect(endpointsObject).toBeInstanceOf(Object)
          expect(endpointsObject).toHaveProperty('GET /api')
          expect(endpointsObject).toHaveProperty('GET /api/categories')
          expect(endpointsObject).toHaveProperty('GET /api/reviews')
          expect(endpointsObject).toHaveProperty('GET /api/reviews/:review_id')
          expect(endpointsObject).toHaveProperty('GET /api/users')
          expect(endpointsObject).toHaveProperty('PATCH /api/reviews/:review_id')
          expect(endpointsObject).toHaveProperty('POST /api/reviews/:review_id/comments')
          expect(endpointsObject).toHaveProperty('DELETE /api/comments/:comment_id')
          for (const endpoint in endpointsObject){
            expect(endpointsObject[endpoint]).toHaveProperty("description")
            if (endpoint.startsWith('GET /api/')){
              expect(endpointsObject[endpoint]).toHaveProperty("exampleResponse")
              expect(endpointsObject[endpoint]).toHaveProperty("queries")
            }
            if(endpoint.startsWith('POST') || endpoint.startsWith('PATCH')){
              expect(endpointsObject[endpoint]).toHaveProperty('exampleRequestBody')
            }
          }
        })
    })
  })

  describe('getCategories', () => {
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
  })

  describe('getReviews', () => {
    describe('no query', () => {
      test('200: GET request responds with array of review objects', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toHaveLength(13)
            reviews.forEach(review =>
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number)
              })
            )
            expect(reviews).toBeSortedBy('created_at', { descending: true })
          })
      })
    })
    describe('category query', () => {
      test('200: GET request returns reviews filtered by given category', () => {
        return request(app)
          .get('/api/reviews?category=euro+game')
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toHaveLength(1)
            expect(reviews[0]).toMatchObject({
              owner: 'mallionaire',
              title: 'Agricola',
              review_id: expect.any(Number),
              category: 'euro game',
              review_img_url:
                'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
              created_at: expect.any(String),
              votes: 1,
              designer: expect.any(String),
              comment_count: expect.any(Number)
            })
          })
      })
      test('200: GET request returns empty array if category doesnt exist', () => {
        return request(app)
          .get('/api/reviews?category=cat_that_doesnt_exist')
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Array)
            expect(reviews).toHaveLength(0)
          })
      })
      test('200: GET request returns empty array if no reviews with that category', () => {
        return request(app)
          .get("/api/reviews?category=children's+games")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Array)
            expect(reviews).toHaveLength(0)
          })
      })
    })
    describe('sort_by query', () => {
      test('200: GET request responds with array of review objects sorted by sort_by query', () => {
        return request(app)
          .get('/api/reviews?sort_by=owner')
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toHaveLength(13)
            reviews.forEach(review =>
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number)
              })
            )
            expect(reviews).toBeSortedBy('owner', { descending: true })
          })
      })
      test('400: GET request with invalid sort_by returns invalid request', () => {
        return request(app)
          .get('/api/reviews?sort_by=invalid_key')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid key to sort by')
          })
      })
    })
    describe('order_by query', () => {
      test('200: GET request with order_by returns ascending list', () => {
        return request(app)
          .get('/api/reviews?order_by=asc')
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy('created_at')
          })
      })
      test('400: GET request with invalid order_by returns invalid request', () => {
        return request(app)
          .get('/api/reviews?order_by=invalid')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid order by')
          })
      })
    })
    describe('multiple queries', () => {
      test('200: returns a list sorted and ordered', () => {
        return request(app)
          .get('/api/reviews?order_by=asc&sort_by=owner')
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy('owner')
          })
      })
      test('200: returns a sorted, ordered and filtered list', () => {
        return request(app)
          .get(
            '/api/reviews?order_by=desc&sort_by=title&category=social+deduction'
          )
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toHaveLength(11)
            reviews.forEach(review => {
              expect(review.category).toBe('social deduction')
            })
            expect(reviews).toBeSortedBy('title', { descending: true })
          })
      })
    })
  })

  describe('getReview', () => {
    test('200: GET request responds with a review object', () => {
      return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 5,
            comment_count: 3
          })
        })
    })
    test('404: GET request with an id out of range returns "Not Found"', () => {
      return request(app)
        .get('/api/reviews/10000')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found')
        })
    })
    test('400: GET request with Invalid request returns bad request', () => {
      return request(app)
        .get('/api/reviews/bananas')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid request')
        })
    })
  })

  describe('getComments', () => {
    test('200: GET request responds with an array of comments', () => {
      return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(3)
          comments.forEach(comment => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number)
            })
          })
          expect(comments).toBeSortedBy('created_at', { descending: true })
        })
    })
    test('200: GET request where review id has no comments', () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array)
          expect(comments).toHaveLength(0)
        })
    })
    test('404: GET request with an id out of range returns "Not Found"', () => {
      return request(app)
        .get('/api/reviews/10000/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Review not found')
        })
    })
    test('400: GET request with Invalid request returns bad request', () => {
      return request(app)
        .get('/api/reviews/bananas/comments')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid request')
        })
    })
    test('400: GET request with Invalid request returns bad request', () => {
      return request(app)
        .patch('/api/reviews/bananas')
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid request')
        })
    })
  })

  describe('postComments', () => {
    test('201: POST request responds with comment object', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({ username: 'mallionaire', body: 'The best game ever!' })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual({
            comment_id: 7,
            body: 'The best game ever!',
            votes: 0,
            author: 'mallionaire',
            review_id: 1,
            created_at: expect.any(String)
          })
        })
    })
    test('201: POST request responds with comment object ignoring extra properties', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          username: 'mallionaire',
          body: 'The best game ever!',
          extra: 'ignored!'
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual({
            comment_id: 7,
            body: 'The best game ever!',
            votes: 0,
            author: 'mallionaire',
            review_id: 1,
            created_at: expect.any(String)
          })
        })
    })

    test('404: POST request with an id out of range', () => {
      return request(app)
        .post('/api/reviews/10000/comments')
        .send({ username: 'mallionaire', body: 'The best game ever!' })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (review_id)=(10000) is not present in table "reviews".'
          )
        })
    })
    test('404: POST request with a username that does not exist', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({ username: 'Erin', body: 'The best game ever!' })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (author)=(Erin) is not present in table "users".'
          )
        })
    })
    test('400: POST request with Invalid request', () => {
      return request(app)
        .post('/api/reviews/bananas/comments')
        .send({ username: 'mallionaire', body: 'The best game ever!' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid request')
        })
    })
    test('400: POST request with empty object (or missing username/body)', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Missing key information from body')
        })
    })
  })

  describe('patchReview', () => {
    test('200 PATCH request responds with updated review with incremented votes', () => {
      return request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 7
          })
        })
    })
    test('200 PATCH request responds with updated review with decremented votes', () => {
      return request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: -2 })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 3
          })
        })
    })
    test('200 PATCH request responds with updated review, ignoring extra keys', () => {
      return request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: -2, another_key: 'hello' })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 3
          })
        })
    })
    test('404: PATCH request responds with review id not found', () => {
      return request(app)
        .patch('/api/reviews/1000')
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('review_id not found')
        })
    })
    test('400: PATCH request responds with missing key', () => {
      return request(app)
        .patch('/api/reviews/1')
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Missing key information from body')
        })
    })
    test('400: Patch request with invalid data-type for increment', () => {
      return request(app)
        .patch('/api/reviews/1')
        .send({ inc_votes: 'kev' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid request')
        })
    })
  })

  describe('getUsers', () => {
    test('200: GET request responds with array of users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4)
          users.forEach(user => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          })
        })
    })
  })

  describe('deleteComment', () => {
    test('204: returns no content', () => {
      return request(app).delete('/api/comments/2').expect(204)
    })
    test('404: returns comment_id not found, if it does not exist', () => {
      return request(app)
        .delete('/api/comments/100')
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toBe('comment_id not found'))
    })
    test('400: returns invalid request', () => {
      return request(app)
        .delete('/api/comments/invalid')
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toBe('Invalid request'))
    })
  })
})
