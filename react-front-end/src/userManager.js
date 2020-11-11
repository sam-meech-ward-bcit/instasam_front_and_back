import jwtDecode from 'jwt-decode'

export function getToken() {
  const token = localStorage.getItem('token')
  return token
}

export function saveToken(accessToken) {
  localStorage.setItem('token', accessToken)
}

export function getTokenDetails() {
  let decoded
  const token = getToken()
  if (!token) {
    return null
  }
  try {
    decoded = jwtDecode(token)
  } catch (e) {
    console.log(e)
  }
  return decoded
}

export function removeToken() {
  localStorage.removeItem('token')
}

