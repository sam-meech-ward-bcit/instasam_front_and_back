import * as database from './mysqlDatabase'

// process.env.MYSQL_HOST = 'localhost',
// process.env.MYSQL_USERNAME = 'root',
// process.env.MYSQL_PASSWORD = '',
// process.env.MYSQL_DATABASE = 'instasam_tests'

const wait = (time) => new Promise(res => setTimeout(res, time))

async function wipeDatabase() {
    await database.run("DELETE FROM comment_hashtags")
    await database.run("DELETE FROM post_hashtags")
    await database.run("DELETE FROM hashtags")
    await database.run("DELETE FROM comment_mention")
    await database.run("DELETE FROM post_mention")
    await database.run("DELETE FROM comment_likes")
    await database.run("DELETE FROM post_likes")
    await database.run("DELETE FROM comments")
    await database.run("DELETE FROM media_items")
    await database.run("DELETE FROM posts")
    await database.run("DELETE FROM filters")
    await database.run("DELETE FROM followers")
    await database.run("DELETE FROM login_activity")
    await database.run("DELETE FROM users")
}

describe("database", () => {

  beforeAll(async () => {
    await wipeDatabase()
  })
  afterAll(async () => {
    // await wipeDatabase()
    await database.end()
  })

  describe('users', () => {

    beforeEach(async () => {
      await wipeDatabase()
    })

    test('should return undefined when no user exists', async () => {
      let error
      try {
        await database.getUserWithEmail('test@test.test')
      } catch (e) {
        error = e
      }
      expect(error).not.toBe(undefined)
    })

    test('should create a new user', async () => {
      const userDetails = {
        username: 'sam',
        password: 'sam',
        email: 'sam@sam.sam',
        fullName: 'sam sam'
      }
      const user = await database.createUser(userDetails)
      const userQueried = await database.getUser(userDetails)
      expect(user).toEqual(userQueried)
    })

    test('should give error when incorrect password is used', async () => {
      const userDetails = {
        username: 'sam',
        password: 'sam',
        email: 'sam@sam.sam',
        fullName: 'sam sam'
      }
      await database.createUser(userDetails)
      let error 
      try {
        await database.getUser({...userDetails, password: 'bad'})
      } catch (e) {
        error = e
      }
      expect(error).not.toBe(undefined)
    })

  })

  describe('posts', () => {

    let user
    const userDetails = {
      username: 'postUser',
      password: 'sam',
      email: 'postUser@sam.sam',
      fullName: 'post user'
    }
    beforeAll(async () => {
      user = await database.createUser(userDetails)
    })

    test("Post with single image", async () => {
      const media = [
        {
          type: 'image',
          url: "some_url"
        }
      ]
      const post = await database.createPost({
        userId: user.id,
        description: "This is a post", 
        media
      })
      expect(post.media.length).toBe(media.length)
    })

    test("Post with multi image", async () => {
      const media = [
        {
          type: 'image',
          url: "some_url1"
        },
        {
          type: 'image',
          url: "some_url2"
        },
        {
          type: 'image',
          url: "some_url3"
        }
      ]
      const post = await database.createPost({
        userId: user.id,
        description: "This is a post 2", 
        media
      })
      console.log(post.media, post.media.length, media.length)
      expect(post.media.length).toBe(media.length)
    })

    test("Like a post", async () => {

      const userDetails = {
        username: 'liker',
        password: 'sam',
        email: 'liker@sam.sam',
        fullName: 'sam sam'
      }
      const likerUser = await database.createUser(userDetails)

      const media = [
        {
          type: 'image',
          url: "some_url"
        }
      ]
      let post = await database.createPost({
        userId: user.id,
        description: "This is a post", 
        media
      })
      expect(post.total_likes).toBe(0)
      post = await database.likePost({userId: likerUser.id, postId: post.id})
      expect(post.total_likes).toBe(1)
    })

    test("Comment a post", async () => {
      const media = [
        {
          type: 'image',
          url: "some_url"
        }
      ]
      let post = await database.createPost({
        userId: user.id,
        description: "This is a post", 
        media
      })
      expect(post.messages.length).toBe(0)

      const comment = await database.addComment({userId: user.id, postId: post.id, message: "This is a comment"})
      post = await database.getPost({postId: post.id})
      
      expect(post.messages.length).toBe(1)

      await database.addComment({userId: user.id, postId: post.id, message: "This is another comment"})
      post = await database.getPost({postId: post.id})

      expect(post.messages.length).toBe(2)

      const comment3 = await database.addComment({userId: user.id, postId: post.id, message: "This is another comment again"})
      post = await database.getPost({postId: post.id})

      expect(post.messages.length).toBe(2)
      expect(post.messages[0].id).toBe(comment3.id)

      console.log(post, comment3)
    })

  })

})