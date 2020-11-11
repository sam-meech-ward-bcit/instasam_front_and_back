import React from 'react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

function theme(pallet) {
  return createMuiTheme({
    backgroundColor: pallet.light ? "white" : "black",
  })
}

export default function Theme(props) {
  const t = theme(props.pallet)

  return (
    <>
    <ThemeProvider theme={t}>
    <CssBaseline />
      {props.children}
    </ThemeProvider>
    </>
  );
}