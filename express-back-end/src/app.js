import express from 'express'
import path from 'path'
import fs from 'fs'
import logger from 'morgan'
import cookieParser from 'cookie-parser'

import s3Manager from './s3Manager'

import usersRouter from './routes/users'
import postsRouter from './routes/posts'
import statusRouter from './routes/status'

import * as mysqlDatabase from './database/mysqlDatabase'

import imageUploader from './imageUploader'

import * as jwt from './jwt'

const bucketName = process.env.BUCKET_NAME || ""
const region = process.env.BUCKET_REGION || ""
const s3 = s3Manager({bucketName, region})

export default async function(params) {
  const app = express()
  const database = params?.database || mysqlDatabase

  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../build')))

  app.use(logger(':method :url :status :res[content-length] - :response-time ms'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, '../public')))


  app.use('/api/users', usersRouter({s3, database, authorize: jwt.authenticateJWT, upload: imageUploader.uploadAvatar, generateAccessToken: jwt.generateAccessToken, uploadsDir: imageUploader.fullAvatarsDir}))
  app.use('/api/posts', postsRouter({s3, database, authorize: jwt.authenticateJWT, upload: imageUploader.uploadPosts, uploadsDir: imageUploader.fullPostsDir}))
  app.use('/api/status',statusRouter({database}) )

  app.get('/api/appName', (req, res) => {
    res.send({name: process.env.APP_NAME || "You didn't setup APP_NAME"})
  })
  
  function handleFileRequest(filePath, res) {
    fs.access(filePath, (err) => {
      if (err) {
        console.log("The file does not exist.")
        res.sendStatus(404)
        return
      } 
      res.sendFile(filePath)
    })
  }

  function getImage(req, res, next) {
    try {
      const { fileKey } = req.params
      const stream = s3.getStream({fileKey})
      stream.pipe(res)
    } catch (error) {
      console.log(error)
      res.status(500).send({error: JSON.stringify(error)})
    }
  }

  app.get('/images/posts/:fileKey', getImage)
  app.get('/images/avatars/:fileKey', jwt.authenticateJWT, getImage)

  app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
  })

  return app
}