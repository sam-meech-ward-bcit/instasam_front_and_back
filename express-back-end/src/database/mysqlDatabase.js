import bcrypt from 'bcryptjs'
import mysql from 'mysql'

const dbDetails = {
  connectionLimit : 10,
  host     : process.env.MYSQL_HOST || 'localhost',
  user     : process.env.MYSQL_USERNAME || 'root',
  password : process.env.MYSQL_PASSWORD || '',
  database : process.env.MYSQL_DATABASE || 'instasam'
}
const connection = mysql.createPool(dbDetails)

export async function status() {
  return new Promise((resolve, reject) => {
    connection.getConnection(function(err, connection) {
      if (err) {
        reject(err)
        return
      }
      resolve({...connection, host: dbDetails.host, database: dbDetails.database})
      connection.end()
    });
  })

}

export function end() {
  connection.end()
}

function dateCompare(d1, d2) {
  const date1 = new Date(d1)
  const date2 = new Date(d2)
  
  return date2 - date1
}

function parsePost(post) {
  return {
    ...post,
    media: (JSON.parse(post.media) || []).filter(a => a), // Cause mysql will put null into an array
    comments: (JSON.parse(post.comments) || []).filter(a => a).sort((a,b) => dateCompare(a.created, b.created)),
    user: (JSON.parse(post.user) || {}),
  }
}

function parseComment(comment) {
  return {
    ...comment,
    user: (JSON.parse(comment.user) || {}),
  }
}

export function run(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, null, function (error, results, fields) {
      if (error) {
        reject(error); return
      }
      resolve(results)
    })
  })
}

function _callProcedure(callback, name, ...params) {
  let query = `CALL ${name}(${params.map(() => '?').join(', ')})`;

  console.log(query, params)
  connection.query(query, params, function (error, results, fields) {
    if (error) {
      console.log(query, error)
      return callback(error)
    }
    callback(null, results[0])
  })
}

function callProcedure(name, ...params) {
  return new Promise((resolve, reject) => {
    _callProcedure((err, rows) => {
      if (err) {
        reject(err); return
      }
      resolve(rows)
    }, name, ...params)
  })
}

export function getPosts({userId, limit}) {
  return callProcedure('get_posts', limit, userId)
  .then(rows => rows.map(parsePost))
}

export function getComments({postId, limit}) {
  return callProcedure('get_comments', limit, postId)
  .then(rows => rows.map(parseComment))
}

export function getPost({postId, userId}) {
  return callProcedure('get_post', postId, userId)
  .then(rows => parsePost(rows[0]))
}



export async function createPost({ userId, description, media }) {
  media = [...media]
  const fistImage = media.shift()
  const result = await callProcedure('create_post', userId, description, fistImage.type, fistImage.url)
  const post = result[0]
  
  let order = 2
  for (const image of media) {
    await callProcedure('add_media_to_post', post.id, image.type, order++, image.url)
  }

  return await getPost({postId: post.id, userId})
}

export async function likePost({ likerId, postId, userId}) {
  await callProcedure('like_post', likerId, postId)
  return await getPost({postId, userId})
}

export async function addComment({ userId, postId, message }) {
  return await callProcedure('add_comment', userId, postId, message).then(rows => parseComment(rows[0]))
}

// export async function likeComment({ userId, commentId }) {
//   await callProcedure('like_comment', userId, postId)
//   return await getPost({postId})
// }

export function getUser(options) {
  return (options.id ? callProcedure('get_user_with_id', options.id) : callProcedure('get_user_with_email', options.email))
  .then(rows => {
    const user = rows[0]
    if (!user)  {
      throw Error("Invalid email")
    }

    if (!options.password) {
      return user
    }

    return new Promise((resolve, reject) => {

        bcrypt.compare(options.password, user.password, (err, same) => {
          if (err) {
            reject(err); return
          }
          if (same) {
            resolve(user)
          } else {
            reject(Error("Passwords don't match"))
          }
        })
    })
  })
}

export function getUserWithEmail(email) {
  return getUser({email})
}

export function createUser({email, username, password, fullName, profilePhoto}) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (error, encrypted) => {
      if (error) {
        reject(error); return
      }

      callProcedure('create_user', username, encrypted, email, fullName, profilePhoto)
      .then(rows => resolve(rows[0]))
      .catch(reject)
    })
  })

}


  