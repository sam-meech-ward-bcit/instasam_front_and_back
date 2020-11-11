import express from 'express'
import fs from 'fs'
import path from 'path'

export default function({database, authorize, upload, uploadsDir, s3}) {
  const router = express.Router()

  // get all posts
  router.get('/', authorize, async function(req, res, next) {
    const posts = await database.getPosts({userId: req.user.id, limit: 100})
    res.send({posts})
  })

  // Create a new post
  router.post('/', authorize, upload, async function(req, res, next) {
    const media = req.files.map(file => ({
      url: `/images/posts/${file.filename}`,
      type: 'image',
      path: path.join(uploadsDir, file.filename)
    }))
    console.log('user', req.user)
    

    try {
      const results = []
      for (const file of media) {
        const result = await s3.upload({file: file.path})
        results.push(result)
      }
      
      const post = await database.createPost({userId: req.user.id, description: req.body.description, media})

      res.send({post})

    } catch (error) {
      console.log(error)
      res.status(500).send({error: error.message})
    }

    // Delete the temporary files
    media.forEach(file => fs.unlinkSync(file.path))
  })


  // Get a post's comments
  router.get('/:id/comments', authorize, async function(req, res, next) {
    const postId = req.params.id
    const comments = await database.getComments({limit:100, postId})
    res.send({comments})
  })

  // Create a new comment
  router.post('/:id/comments', authorize, async function(req, res, next) {
    const userId = req.user.id
    const postId = req.params.id
    const { message } = req.body
    const comment = await database.addComment({ userId, postId, message})
    res.send({comment})
  })

  // Create a new like
  router.post('/:id/likes', authorize, async function(req, res, next) {
    const userId = req.user.id
    const postId = req.params.id
    const post = await database.likePost({ likerId: userId, userId, postId })
    res.send({post})
  })

  return router
}

