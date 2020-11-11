import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { TextField, Card, Button } from '@material-ui/core'
// https://www.npmjs.com/package/react-multiple-image-input
import MultiImageInput from 'react-multiple-image-input'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
  },
  input: {
    display: 'none',
  },
}))

export default function NewPost(props) {
  const classes = useStyles()

  const [images, setImages] = useState({})
  const [description, setDescription] = useState("")

  const submit = event => {
    event.preventDefault()
    props.onSubmit({images, description})
  }

  return (
    <Card className={classes.root}>
    <MultiImageInput
      images={images}
      setImages={setImages}
      allowCrop={false}
    />
    <form onSubmit={submit}>
    <TextField value={description} onChange={e => setDescription(e.target.value)} label="Description"></TextField>
    <Button type="submit">Post</Button>
    </form>
    </Card>
  )
}