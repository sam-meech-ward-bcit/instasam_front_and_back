import React from 'react'
import LoginForm from './index'
import { actions } from '@storybook/addon-actions'


export default {
  title: 'UserAuth/LoginForm',
  component: LoginForm,
}

const events = actions({ onSubmit: 'Submit!' })

export const MyLogin = () => (
    <LoginForm  {...events}>
    </LoginForm>
)
