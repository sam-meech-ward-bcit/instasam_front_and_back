import express from 'express'
import path from 'path'
import fs from 'fs'

export default function({database, authorize, upload, generateAccessToken, s3, uploadsDir}) {
  const router = express.Router()

  function sendUser({res, user}) {
    const accessToken = generateAccessToken({user: {id: user.id, fullName: user.full_name, email: user.email, username: user.username}})
    res.cookie('token', accessToken)
    res.send({ accessToken: accessToken })
  }

  // Create a new user
  router.post('/', upload, async function(req, res, next) {
    const image = req.file
    let user = req.body.user
    if (typeof user === 'string') {
      user = JSON.parse(user)
    }

    
    const imageUrl = `/images/avatars/${image.filename}`
    const filePath = path.join(uploadsDir, image.filename)
    
    console.log('avatar', image, 'user', user, 'imageUrl', imageUrl)
    try {
      const result = await s3.upload({file: filePath})

      const dbuser = await database.createUser({...user, profilePhoto: imageUrl})
      console.log("Created user", dbuser)
      sendUser({res, user: dbuser})
    } catch (error) {
      console.log(error)
      res.send({error})
    }
  })

  
  router.post('/login', async function(req, res, next) {
    try {
      const user = await database.getUser(req.body.user)
      sendUser({res, user})
    } catch (error) {
      console.log(error)
      res.sendStatus(403)
    }
  })
  
  router.get('/me', authorize, async function(req, res, next) {
    const user = await database.getUser({id: req.user.id})
    sendUser({res, user})
  })

  router.post('/logout', function(req, res, next) {
    // res.cookie('token', null)
    res.cookie('token', {expires: Date.now()});
    res.send({user: null})
  })

  // Get a user's posts
  router.get('/:id/posts', async function(req, res, next) {
    res.send({})
  })

  return router
}
