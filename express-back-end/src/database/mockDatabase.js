export let posts = [{}]
export let users = [{}]

function mockFunction(fn) {
  function newfn(...params) {
    newfn.callCount++
    newfn.params = params
    return fn(...params)
  }
  newfn.callCount = 0
  return newfn
}

export function storeSession() {
  
}

export const getPosts = mockFunction(async function ({userId, limit}) {
  return posts
})

export const getPost = mockFunction(async function ({postId}) {
  return posts[0]
})

export const createPost = mockFunction(async function ({ userId, description, media }) {
  const post = {
    user_id: userId, 
    description, 
    media,
    id: posts.length+1,
    total_likes: 0,
    comments: []
  }
  posts.push(post)

  return post
})

export const likePost = mockFunction(async function ({ userId, postId }) {
  const post = posts.find(post => post.id == postId)
  post.total_likes++
  return post
})

export const addComment = mockFunction(async function ({ userId, postId, message }) {
  const post = posts.find(post => post.id == postId)
  post.comments.push({user_id: userId, message})
  return post
})

export const getUser = mockFunction(async function (options) {
  return users.find(user => user.email === options.email)
})

export const getUserWithEmail = mockFunction(async function (email) {
  return getUser({email})
})

export const createUser = mockFunction( async function ({email, username, password, fullName}) {
  const user = {
    id: users.length + 1,
    email,
    username,
    password,
    full_name: fullName
  }
  console.log('create user', user)

  users.push(user)

  return user
})


  