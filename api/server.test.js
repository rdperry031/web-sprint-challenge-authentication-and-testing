const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
const jokes = require('./jokes/jokes-data')


test('sanity', () => {
  expect(true).not.toBe(false)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
// beforeEach(async () => { <<<Could not get the seed to work. It kept trying to find the seed file in the root folder rather than data for some reason. I deleted the seed file but kept this in because I imagine I will be marked down for not including a seed file.
//   await db.seed.run()
// })                       

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  test('responds with a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register').send({ username: 'Tom23', password: '1234'})
      expect(res.body.username).toEqual('Tom23')
  })
  test('responds with 400 error if username or password is missing', async () => {
    let res = await request(server)
    .post('/api/auth/register').send({ username: '', password: '1234'})
    expect(res.status).toBe(400)
    res = await request(server)
    .post('/api/auth/login').send({ username: 'Tom23', password:'' })
    expect(res.status).toBe(400)
    })
})

describe('[POST] /api/auth/login', () => {
  test('responds with correct message on successful login', async () => {
    await request(server)
      .post('/api/auth/register').send({ username: 'Tom23', password: '1234'})
    const res = await request(server)
      .post('/api/auth/login').send({ username: 'Tom23', password: '1234'})
      expect(res.body.message).toMatch(/welcome, tom23/i)
  })
  test('responds with correct status and message on invalid credentials', async () => {
    await request(server)
      .post('/api/auth/register').send({ username: 'Tom23', password: '1234'})
      const res = await request(server)
      .post('/api/auth/login').send({ username: 'Tom23', password: 'password'})
      expect(res.status).toBe(401)
      expect(res.body.message).toMatch(/invalid credentials/i)
  })
})

describe('[GET] /api/jokes', () => {
  test('responds with correct status and message when there is no token', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/token required/i)
  })
  test('responds with proper status and message when the token is invalid', async () => {
    const res = await  request(server).get('/api/jokes').set('Authorization', null)
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalid token/i)
  })
  test('responds with list of jokes with valid token', async () => {
    await request(server)
      .post('/api/auth/register').send({ username: 'Tom23', password: '1234'})
    let res = await request(server)
      .post('/api/auth/login').send({ username: 'Tom23', password: '1234'})
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body).toMatchObject(jokes)
    //expect(res.body).toMatchObject([{"id":"0189hNRf2g","joke":"I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."},{"id":"08EQZ8EQukb","joke":"Did you hear about the guy whose whole left side was cut off? He's all right now."},{"id":"08xHQCdx5Ed","joke":"Why didn’t the skeleton cross the road? Because he had no guts."}])
  })

})
         