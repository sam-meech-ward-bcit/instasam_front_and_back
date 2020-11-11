import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SignUpForm from '../../components/UserAuth/SignUpForm'

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
  const classes = useStyles(props)
  
  async function onSubmit(values) {
    setError(null)
    for(const key in values) {
      if (!values[key]) {
        setError(`You must enter a valid ${key}`)
        return
      }
    }
    try {
      await props.signup(values)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className={classes.container}>
      <SignUpForm onSubmit={onSubmit}></SignUpForm>
      <Typography>Already have an account? <Link to="/login">Login</Link></Typography>
      {error && <Typography>{error}</Typography>}
    </div>
  )
}
