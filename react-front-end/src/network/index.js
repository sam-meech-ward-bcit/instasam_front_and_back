import axios from 'axios'
import { v4 as uuid } from 'uuid'

import { saveToken, getToken, getTokenDetails, removeToken } from '../userManager'

function token() {
  const token = getToken()
  if (!token) {
    return {}
  }
  return { Authorization: `Bearer ${token}` }
}

function http({method, path, params}) {
  console.log(token())
  const headers = {
    ...token(),
    "Access-Control-Allow-Origin" : "*",
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  console.log('headers', headers)
  if (method == 'get') {
    return axios[method](path, { headers })
  }
  return axios[method](path, params, { headers })
}

export const login = ({email, password}) => {
  console.log(email, password)
  return http({method: 'post', path: `/api/users/login`, params: {user: {email, password}}})
  .then(res => {
    const { accessToken } = res.data
    console.log(accessToken)
    saveToken(accessToken)
    const tokenData = getTokenDetails()
    if (!tokenData) {
      return null
    }
    return tokenData
  })
}

export const logout = () => {
  removeToken()
  return http({method: 'post', path: `/api/users/logout`}).then(res => res.data)
}

export const signUp = ({email, password, username, image}) => {
  console.log(email, password, image)
  // return http({method: 'post', path: `/api/users`, params: {user: {email, password, username, fullName: "Full name"}}})
  // .then(res => {
  //   const { accessToken } = res.data
  //   console.log(accessToken)
  //   saveToken(accessToken)
  //   const tokenData = getTokenDetails()
  //   if (!tokenData) {
  //     return null
  //   }
  //   return tokenData
  // })

  const formData = new FormData()
 
  formData.append("avatar", image)
  formData.append('user', JSON.stringify({email, password, username, fullName: "Full name"}))

  return axios.post('/api/users', formData, { headers: {'Content-Type': 'multipart/form-data', ...token()}})
  .then(res => {
    const { accessToken } = res.data
    console.log(accessToken)
    saveToken(accessToken)
    const tokenData = getTokenDetails()
    if (!tokenData) {
      return null
    }
    return tokenData
  })
}

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1)
    n -= 1 // to make eslint happy
  }
  return new File([u8arr], filename || uuid(), { type: mime })
}

export function savePost({images, description}) {
  const formData = new FormData();
 
  images.map(dataURLtoFile).forEach(image => formData.append("images", image))
  formData.append('description', description)

  return axios.post('/api/posts', formData, { headers: {'Content-Type': 'multipart/form-data', ...token()}})
  .then(res => res.data)
}

export function saveComment({postId, message}) {
  return http({method: 'post', path: `/api/posts/${postId}/comments`, params: {message, postId}})
  .then(res => res.data)
}

export function likePost({postId}) {
  return http({method: 'post', path: `/api/posts/${postId}/likes`, params: {postId}})
  .then(res => res.data)
}

export function getPosts() {
  return http({method: 'get', path: `/api/posts?limit=11`})
  .then(res => res.data)
}

export function getComments({postId}) {
  return http({method: 'get', path: `/api/posts/${postId}/comments`})
  .then(res => res.data)
}

export async function me() {
  const tokenData = getTokenDetails()
  if (!tokenData) {
    return null
  }
  return tokenData
  // return http({method: 'get', path: `/api/users/me`})
  // .then(res => res.data)
}

export function appName() {
  return http({method: 'get', path: `/api/appName`})
  .then(res => res.data)
}