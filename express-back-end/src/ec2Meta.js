import axios from 'axios'
import path from 'path'

const baseURL = "http://169.254.169.254/latest/meta-data"

const instance = axios.create({
  baseURL,
  timeout: 1000
})

export async function ec2Meta() {
  const result = await instance.get()
  return result.data
}

export async function ipv4() {
  const result = await instance.get('/local-ipv4')
  return result.data
}

export async function ipv4Public() {
  try {
    const result = await instance.get('/public-ipv4')
    return result.data
  } catch (err) {
    return err.response.status
  }
}

export async function instanceId() {
  const result = await instance.get('/instance-id')
  return result.data
}

export async function iam() {
  try {
    const result = await instance.get('/iam/info')
    return result.data
  } catch (err) {
    return err.response.status
  }
}

export async function hostname() {
  const result = await instance.get('/hostname')
  return result.data
}

// ipv4().then(console.log)