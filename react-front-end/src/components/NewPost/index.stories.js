
import React from 'react'
import { actions } from '@storybook/addon-actions'

import NewPost from './index'

export default {
  title: 'General/NewPost',
  component: NewPost,
}

const events = actions({ onSubmit: 'submit' })

export const MyNewNewPost = () => (
  <NewPost 
  {...events}
  ></NewPost>
)
