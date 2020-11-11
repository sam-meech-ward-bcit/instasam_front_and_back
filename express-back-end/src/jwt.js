import jwt from "jsonwebtoken"

const secret = process.env.ACCESS_TOKEN_SECRET || 'my secret'

export function authenticateJWT(req, res, next) {
  // next(); return
  let token, authHeader = req.headers.authorization

  if (authHeader) {
    token = authHeader.split(' ')[1]
  } else {
    token = req.cookies['token']
  }

  if (!token) {
    console.log("no token sent to server")
    res.sendStatus(401)
    return 
  }

  
  jwt.verify(token, secret, (err, body ) => {
    if (err) {
      console.log(err)
      res.sendStatus(403)
      return 
    }
    console.log(body)
    req.user = body.user
    next()
  })
}

export function generateAccessToken(user) {
  const token = jwt.sign(user, secret, { expiresIn: "100000000000000000000000s" })
  return token
}
