import request from 'supertest'

import app from './app'
import * as database from './database/mockDatabase'
// import * as database from './database/mysqlDatabase'


describe("app users", () => {
  let testApp
  beforeAll(() => testApp = request(app({database})))

  describe('The users path', () => {
    test('It should create a new user', async () => {
      expect(database.createUser.callCount).toBe(0)

      const user = {email: 'sam@sam.sam', username: 'sam', password: 'sam', fullName: 'sam sam'}
      const response = await testApp.post('/api/users').send({user})

      expect(database.createUser.callCount).toBe(1)
      expect(database.createUser.params[0]).toEqual(user)
    })

    test('It should respond with a session', async () => {
      const user = {email: 'sam@sam.sam', username: 'sam', password: 'sam', fullName: 'sam sam'}
      const response = await testApp.post('/api/users').send({user})

      expect(response.header['set-cookie']).not.toBe(null)
      console.log(response.header['set-cookie'])
    })
  })

  describe('login', () => {
    test('It should check the database for the current user', async () => {
      expect(database.getUser.callCount).toBe(0)
      const user = {email: 'sam@sam.sam', password: 'sam'}
      await testApp.post('/api/users/login').send({user})
      expect(database.getUser.callCount).toBe(1)
      expect(database.getUser.params[0]).toEqual(user)
    })

    test('It should respond with a session', async () => {
      const user = {email: 'sam@sam.sam', password: 'sam'}
      database.users.push({id: 100, ...user})
      const response = await testApp.post('/api/users/login').send({user})

      expect(response.header['set-cookie']).not.toBe(null)
      console.log(response.header['set-cookie'])
    })
  })

})