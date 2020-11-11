import React from 'react'

import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as icons from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  button: {
    // backgroundColor: theme.action.main,
    // color: theme.action.contrastText,
    fontSize: "1.2em",
    borderRadius: "8px",
    '&:hover': {
      // backgroundColor: theme.primary.main,
    }
  },
  buttonIcon: {
    height: '100%',
    margin: 0,
  }
}))

export default function Button(props) {
  const classes = useStyles(props)
  let Icon = props.icon ? icons[props.icon] : null

  return (
    <IconButton {...props} size="medium" className={`${classes.button} ${props.className}`} onClick={props.onClick} color="inherit" aria-label="menu">
      { Icon && 
        <Icon className={classes.buttonIcon} />
      }
      {props.children}
    </IconButton>
  )
}