
import React from 'react'
import { actions } from '@storybook/addon-actions'

import Post from './index'

export default {
  title: 'General/Post',
  component: Post,
}

const events = actions({ submitComment: 'submit comment', like: 'like', comment: 'comment' })

export const MyPost = () => (
  <Post 
  {...events} 
  post={
    {
      id: 1,
      description: "A post about things and stuff",
      media: [{url:"https://cdn.britannica.com/84/73184-004-E5A450B5/Sunflower-field-Fargo-North-Dakota.jpg"}],
      total_likes: 100,
      user:{
        username: "Sam" 
      },
      comments: [{
        user: {
          username: "Someone else"
        },
        content: "A comment"
      },
      {
        user: {
          username: "Someone else 2"
        },
        content: "A comment 2"
      }]
    }
  }
  
  me={
    {
      liked: true
    }
  }
  ></Post>
)
