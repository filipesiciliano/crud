'use strict'

import jwt from 'jsonwebtoken'

export default function (req, res, next) {

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    const authHeader = req.headers['authorization']
    const authHeaderValue = authHeader ? authHeader.split(' ') : []
    if (authHeaderValue.length === 2) {
      token = authHeaderValue[1]
    }
  }

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, req.app.get('jwtSecret'), function(err, decoded) {
      if (err) {
        return res.status(403).json({ error: 'Falha ao autenticar utilizando o token.' })
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })

  } else {

    // if there is no token, return an error
    return res.status(403).json({ error: 'Nenhum token foi localizado.' })

  }
}
