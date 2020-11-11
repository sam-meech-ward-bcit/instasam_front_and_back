import React, { useState, useEffect } from 'react'

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom"

import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'

import * as network from './network'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import Theme from './Theme'

function PrivateRoute({ component: Component, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => user
        ? <Component {...props} {...rest} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

function PublicRoute({ component: Component, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => !user
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const loginOrSignUp = promise => {
    promise
    .then(data => {
      if (!data) {
        setError(null)
        setUser(null)
        return
      }
      if (data.errors) {
        setError(data.errors[0])
        setUser(null)
        return
      }
      setError(null)
      setUser(data.user)
    })
    .catch(error => {
      console.log(error)
      setError("Invalid email or password")
      // if (error.message.includes("403")) {
      //   setError(null)
      // } else {
      //   setError(error)
      // }
      setUser(null)
    })
  }

  useEffect(() => {
    loginOrSignUp(network.me())
  }, [])


  const sendLogin = credentials => {
    loginOrSignUp(network.login(credentials))
  }

  const sendSignUp = credentials => {
    loginOrSignUp(network.signUp(credentials))
  }

  const logout = () => {
    setUser(null)
    network.logout()
  }

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const MySignup = () => (
    <Signup signup={sendSignUp}></Signup>
  )

  const MyLogin = () => (
    <Login signin={sendLogin}></Login>
  )

  const MyHome = () => (
    <Home {...network} logout={logout} user={user} ></Home>
  )

  return (
    <Theme pallet={prefersDarkMode ? 'dark' : 'light'}>
      { error ?
      <h2>{error}...</h2> : 
    <Router>
      <Switch>
        <PublicRoute path="/login" user={user} component={MyLogin}></PublicRoute>
        <PublicRoute path="/signup" user={user} component={MySignup}></PublicRoute>
        <PrivateRoute path="/" user={user} component={MyHome}></PrivateRoute>
      </Switch>
    </Router>
    }
    </Theme>
  )
}

export default App
