import React from 'react'
import SignupForm from './index'
import { actions } from '@storybook/addon-actions'

export default {
  title: 'UserAuth/SignupForm',
  component: SignupForm,
}

const events = actions({ onSubmit: 'Submit!' })

export const MySignup = () => (
    <SignupForm  {...events}>
    </SignupForm>
)
