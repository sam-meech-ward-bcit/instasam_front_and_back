import React, { useState } from 'react'

import { Box, TextField, Button, Slide, Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as icons from '@material-ui/icons'

import clsx from 'clsx'

import { red } from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  textField: {
    flexGrow: 1
  },
  description: {
    marginBottom: 10
  },
  mainCardContent: {
    paddingTop: 0
  }
}))

export default function Post(props) {
  const classes = useStyles(props)
  const [message, setMessage] = useState("")

  const { post, user, me } = props

  const LeftIcon = icons['MoreHoriz']

  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    const exp = !expanded
    setExpanded(exp)
    props.setExpanded({...post, flag: exp})
  }

  const imageComponenets = post.media.map((image, index) => (
    <CardMedia 
        key={index}
        className={classes.media}
        image={image.url}
      />
  ))

  const commentComponents = post.comments.map(comment => (
    <Box display="flex" key={comment.id}>
    <Typography variant="subtitle2" component="h6">
      {comment.user.username}: &nbsp;
    </Typography>
    <Typography variant="body2" color="textSecondary" component="p">
      {comment.message}
    </Typography>
    </Box>
  ))

  const postComment = event => {
    event.preventDefault()
    props.submitComment({message, id: post.id})
  }
  const likeAction = () => {
    props.like(post)
  }
  const commentAction = () => {
    props.comment(post)
  }


  return (
    <Card className={`${classes.root} ${props.className}`}>
      <CardHeader
        avatar={
          <Avatar aria-label="user" alt={post.user.username} src={post.user.profile_photo} className={classes.avatar}>
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <LeftIcon />
        //   </IconButton>
        // }
        title={post.user.username}
        subheader=""
      />

      {imageComponenets}

      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={likeAction}>
      { me.liked ? <FavoriteIcon /> : <FavoriteBorderIcon/> }
        </IconButton>
        {/* <IconButton aria-label="comment" onClick={commentAction}>
          <CommentIcon />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      
      <CardContent className={classes.mainCardContent}>
        <Typography className={classes.description} variant="body2" component="p">
          Liked by {post.total_likes} people
        </Typography>
        <Typography className={classes.description} variant="body2" component="p">
          {post.total_comments || 0} comments
        </Typography>
        <Typography className={classes.description} variant="body2" color="textSecondary" component="p">
          {post.description}
        </Typography>
        {commentComponents}
      </CardContent>
      
      <hr />
      
      <form className={classes.root} noValidate autoComplete="off" onSubmit={postComment}>
        <Box display="flex">
          <TextField value={message} onChange={e => setMessage(e.target.value)} className={classes.textField} id="standard-basic" label="Add a comment..." />
          <Button type="submit">Post</Button>
        </Box>
      </form>
    </Card>
  )
}