import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import PageHeader from '../../components/PageHeader'
import Post from '../../components/Post'
import NewPost from '../../components/NewPost'

const useStyles = makeStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  post: {
    margin: "10px 0"
  }
}))

export default function Home(props) {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState("")
  const [creatingNewPost, setCreatingNewPost] = useState(false)

  const classes = useStyles(props)

  useEffect(() => {
    (async () => {
      const data = await props.getPosts()
      console.log(data)
      setPosts(data.posts)
      const nameData = await props.appName()
      setTitle(nameData.name)
    })()
  }, [])

  const addNewComment = async ({message, id}) => {
    const { comment } = await props.saveComment({message, postId: id})

    setPosts(posts => posts.map(post => post.id != id ? post : {...post, comments: [comment, ...post.comments]} ))
  }

  const newPost = () => {
    setCreatingNewPost(creatingNewPost => !creatingNewPost)
  }

  const createPost = async ({images, description}) => {
    let imagesArray = []
    for (const key in images) {
      imagesArray.push(images[key])
    }
    const result = await props.savePost({images: imagesArray, description})
    console.log(result)
    setPosts(posts => [result.post, ...posts])
    setCreatingNewPost(false)
  }

  const likePost = async ({id}) => {
    const { post } = await props.likePost({postId: id})
    setPosts(posts => posts.map(p => p.id != id ? p : post))
  }

  const showAllComments = async ({id, flag}) => {
    if (flag) {
      const {comments} = await props.getComments({postId: id})
      setPosts(posts => posts.map(p => p.id != id ? p : {...p, comments}))
    } else {
      setPosts(posts => posts.map(p => p.id != id ? p : {...p, comments: p.comments.slice(0,2)}))
    }
  }

  const postComponents = posts.map(post => {
    return <Post 
      key={post.id}
      className={classes.post}
      submitComment={addNewComment}
      like={likePost}
      comment={console.log}
      user={props.user}
      post={post}
      setExpanded={showAllComments}
      me={
        {
          liked: true
        }
      }
      ></Post>
  })

  return (
    <div>
      <PageHeader title={title} signOut={props.logout} newPost={newPost} ></PageHeader>
      <div className={classes.posts}>
      { creatingNewPost ?
      <NewPost onSubmit={createPost}></NewPost>
      :
      postComponents
      }
      </div>
    </div>
  )
}