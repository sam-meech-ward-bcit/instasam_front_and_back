import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import LoginForm from '../../components/UserAuth/LoginForm'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "600px", 
    margin: "auto",
    [theme.breakpoints.down('sm')]: {
      maxWidth: "80%",
    },
  },
}))

export default function SignUp(props) {
  const [error, setError] = useState(null)
  const classes = useStyles()

  async function onSubmit(values) {
    setError(null)
    try {
      await props.signin(values)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className={classes.container}>
      <LoginForm onSubmit={onSubmit}></LoginForm>
      <Typography>Don't have an account? <Link to="/signup">Sign up</Link></Typography>
      {error && <Typography>{error}</Typography>}
    </div>
  )
}
