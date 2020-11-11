import request from 'supertest'

import app from './app'
import * as database from './database/mockDatabase'
// import * as database from './database/mysqlDatabase'


describe("app users", () => {
  let testApp
  beforeEach(() => testApp = request(app({database})))

  describe('The posts path', () => {
    test("It should reject when there's no cookie", async () => {
      const response = await testApp.get('/api/posts')
      expect(response.forbidden).toBe(true)
      console.log(response)
    })

    // test("It should not reject when there's a cookie", async () => {
    //   console.log(testApp)
    //   const response = await (testApp.get('/api/posts').set({
    //     'Cookie': 'connect.sid=s%3AC9MTMeCmlpRvzeL6eS3LPcCFvv7_zFg7.vo7hETsqscbLpHPHEtbqvr%2B4cpRtKHj8jucTW9Tkshk',
    //     'Accept': '*/*'
    //   }
    //   ))
    //   expect(response.forbidden).toBe(false)
    // })

    // test('It should call create post', async () => {
    //   expect(database.createUser.callCount).toBe(0)

    //   const user = {email: 'sam@sam.sam', username: 'sam', password: 'sam', fullName: 'sam sam'}
    //   const response = await testApp.post('/api/users').send({user})

    //   expect(database.createUser.callCount).toBe(1)
    //   expect(database.createUser.params[0]).toEqual(user)
    // })
  })

 
})