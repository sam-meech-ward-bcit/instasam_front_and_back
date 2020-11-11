import React from 'react'
import { actions } from '@storybook/addon-actions'

import Button from './index'

export default {
  title: 'General/Button',
  component: Button,
}

const events = actions({ onClick: 'Submit'})

export const LightIcon = () => (
    <Button {...events} icon="ThumbUp"></Button>
)

export const LightText = () => (
    <Button {...events}>Submit</Button>
)
