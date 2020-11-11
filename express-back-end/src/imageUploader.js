import multer  from 'multer'
import path from 'path'

import sizeOf from 'image-size'

import express from 'express'
const uploadPostsRouter = express.Router()

const publicPath = path.join(__dirname, '../public')
const uploadsDir = 'uploads'
const postsDir = 'posts'
const avatarsDir = 'avatars'
const postsPath = path.join(uploadsDir, postsDir)
exports.postsPath = postsPath

const imageSizer = (req, res, next) => {
  if (req.file) {
    req.image = {}
    req.image.path = path.join(postsPath, req.file.filename)
    req.image.size = sizeOf(path.join(publicPath ,req.image.path))
  }
  next()
}

const fullPostsDir = path.join(publicPath, uploadsDir, postsDir)
const uploadPostsMutler = multer({ dest: fullPostsDir }).array('images')
uploadPostsRouter.use(uploadPostsMutler)
uploadPostsRouter.use(imageSizer)

const fullAvatarsDir = path.join(publicPath, uploadsDir, avatarsDir)
const uploadAvatar = multer({ dest: fullAvatarsDir }).single('avatar')

export default {
  uploadPosts: uploadPostsRouter,
  fullPostsDir,
  uploadAvatar,
  fullAvatarsDir
}