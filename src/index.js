'use strict'

// Dependencies
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import mongoose from 'mongoose'

// Load the API versions
import apiVersionOne from './v1'

// Load the application configuration
import config from './config.json'

const port = process.env.PORT || config.port
const app = express()

// Init the database
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE || config.database)

// Wait for database connection to start the app
mongoose.connection.once('open', function() {
    // JWT secret variable
    app.set('jwtSecret', process.env.JWT_SECRET || config.jwtSecret)

    // Start logging
    app.use(morgan('dev'))

    // Handle CORS
    app.use(cors({
        exposedHeaders: config.corsHeaders
    }))

    // Body Parser
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json({ limit : process.env.BODY_LIMIT || config.bodyLimit }))

    // Static Routes
    app.get('/', function(req, res) {
        res.send('A API está sendo executada na porta ' + port)
    })

    // API Routes
    app.use('/v1', apiVersionOne())

    // Start the server
    app.listen(port)
    console.log('API sendo executada na porta ' + port)
})
