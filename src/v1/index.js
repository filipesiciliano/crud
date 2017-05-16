'use strict'

import express from 'express'

import user from './endpoints/user'
import products from './endpoints/products'

export default function () {
    const router = express.Router()

    router.use('/user', user())
    router.use('/products', products())

    return router
}
