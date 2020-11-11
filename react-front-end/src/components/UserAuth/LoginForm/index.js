import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Button from '../../General/Button'

const useStyles = makeStyles((theme) => ({
  root: {
  },
  button: {
    margin: "20px 0",
    width: "100%"
  }
}));

export default function LoginForm(props) {
  const classes = useStyles(props)
  const [values, setValues] = useState({username: "", password: "", email: ""})

  function change(key) {
    return function(event) {
      const newValues = {...values}
      newValues[key] = event.target.value
      setValues(newValues)
    }
  }

  function submit(event) {
    event.preventDefault()
    props.onSubmit(values)
  }

  return (
    <form onSubmit={submit} className={classes.root} noValidate autoComplete="off">
      {/* <TextField value={values.username} onChange={change("username")} id="username-input" fullWidth label="Username" /> */}
      <TextField value={values.email} onChange={change("email")} id="email-input" fullWidth label="Email" />
      <TextField type="password" value={values.password} onChange={change("password")} id="password-input" fullWidth label="Password" />
      <Button className={classes.button} type="submit">Login</Button>
    </form>
  );
}
