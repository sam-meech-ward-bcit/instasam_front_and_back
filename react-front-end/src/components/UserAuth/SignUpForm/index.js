import React, { useState, createRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Button from '../../General/Button'

const useStyles = makeStyles((theme) => ({
  root: {
  },
  button: {
    margin: "20px 0",
    width: "100%"
  },
  input: {
    display: 'none',
  },
}));

export default function SignUpForm(props) {
  const classes = useStyles(props)
  const [values, setValues] = useState({username: "", email: "", password: "", image: null})

  const imageRef = createRef()

  function change(key) {
    return function(event) {
      const newValues = {...values}
      newValues[key] = event.target.value
      setValues(newValues)
    }
  }

  function submit(event) {
    event.preventDefault()
    props.onSubmit({...values, image: imageRef.current.files[0]})
  }

  return (
    <form onSubmit={submit} className={classes.root} noValidate autoComplete="off">
      <TextField value={values.username} onChange={change("username")} id="username-input" fullWidth label="Username" />
      <TextField value={values.email} onChange={change("email")} id="email-input" fullWidth label="Email" />
      <TextField type="password" value={values.password} onChange={change("password")} id="password-input" fullWidth label="Password" />
      
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        ref={imageRef}
      />
      <label htmlFor="contained-button-file">
        <Button  className={classes.button} variant="contained" color="primary" component="span">
          Profile Image
        </Button>
      </label>
      
      
      <Button className={classes.button} type="submit">Sign Me Up!</Button>
    </form>
  );
}
