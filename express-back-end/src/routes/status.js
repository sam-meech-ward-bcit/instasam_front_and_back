
import express from 'express'

import * as ec2Meta from '../ec2Meta'

export default function({database}) {
  const router = express.Router()


  router.get('/', async (req, res) => {
    let mysql 

    try {
      const connection = await database.status()
      mysql = {
        state: connection.state,
        host: connection.host,
        datbase: connection.database
      }
    } catch (err) {
      mysql = err
    }

    let ec2 = {}
    try {
      ec2.ipv4 = await ec2Meta.ipv4()
      ec2.hostname = await ec2Meta.hostname()
      ec2.instanceId = await ec2Meta.instanceId()
      ec2.iam = await ec2Meta.iam()
      ec2.ipv4Public = await ec2Meta.ipv4Public()
    } catch (err) {
      console.log(err)
      ec2 = "error"
    }

    let other = {}

    const data = {
      mysql,
      ec2,
      other
    }
    console.log(data)

    res.send(data)

  })

return router
}
