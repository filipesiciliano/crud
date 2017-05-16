'use strict'

// Dependencies
import express from 'express'
import jwt from'jsonwebtoken'

// Load the User model
import User from '../../models/User'

export default function() {
    const router = express.Router()

    router.post('/login', (req, res, next) => {
        User.findOne({
            email: req.body.email
        }, function(err, user) {

            if (err) return res.status(500).json({ error: err })

            if (!user || user.comparePassword(req.body.password) === false) {
                res.sendStatus(401)
            } else {
                // if user is found and password is right, create a token
                const token = jwt.sign(user.toJSON(), req.app.get('jwtSecret'), {
                    expiresIn : 60*60*24 // expires in 24 hours
                })

                // return the information including token as JSON
                res.json({ token: token })
            }
        })
    })

    router.post('/signup', (req, res, next) => {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            active: true
        })

        user.save().then(function(err) {
            res.sendStatus(201)
        }, function(err) {
            if (err.name === 'ValidationError') {
                const errorObj = err.errors[Object.keys(err.errors)[0]]
                res.status(422).json({
                    'field': errorObj.path,
                    'type': errorObj.kind
                })
            } else if (err.code === 11000) {
                res.status(422).json({
                    'field': 'email',
                    'type': 'unique'
                })
            } else {
                res.status(500).json(err)
            }
        })
    })

    return router
}
