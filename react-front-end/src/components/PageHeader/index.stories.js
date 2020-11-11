
import React from 'react'
import { actions } from '@storybook/addon-actions'

import PageHeader from './index'

export default {
  title: 'General/PageHeader',
  component: PageHeader,
}

const events = actions({ signOut: 'sign out', newPost: "new post" })

export const MyPageHeader = () => (
  <PageHeader 
  {...events}
  ></PageHeader>
)
