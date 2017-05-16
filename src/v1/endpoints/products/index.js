'use strict'

import express from 'express'

import authenticate from '../../middlewares/authenticate'
import throttle from '../../middlewares/throttle'
import Product from '../../models/Product'

export default function () {
    const router = express.Router()

    router.use(authenticate)
    router.use(throttle)

    router.get('/', function (req, res, next) {
        Product.find(null, function (err, products) {

            if (err) return res.status(500).json({ error: err })

            res.json({ products: products })
        })
    })

    router.post('/', function (req, res, next) {
        let product = new Product({
            name: req.body.name,
            price: req.body.price,
            active: req.body.active
        })

        product.save().then(function (err) {
            res.sendStatus(201)
        }, function(err) {
            if (err.name === 'ValidationError') {
                const errorObj = err.errors[Object.keys(err.errors)[0]]
                res.status(422).json({
                    'field': errorObj.path,
                    'type': errorObj.kind
                })
            } else {
                res.status(500).json({ error: err })
            }
        })
    })

    router.get('/:id', function (req, res, next) {
        Product.findById(req.params.id,
            function(err, product) {

                if (err) return res.status(500).json({ error: err })

                res.json({ product: product })
            })
    })

    router.put('/:id', function (req, res, next) {
        Product.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                price: req.body.price,
                active: req.body.active
            },
            { new: true },
            function(err, product) {

                if (err) return res.status(500).json({ error: err })

                res.sendStatus(204)
            })
    })

    router.delete('/:id', function (req, res, next) {
        Product.findByIdAndRemove(req.params.id,
            function(err, product) {

                if (err) return res.status(500).json({ error: err })

                res.sendStatus(204)
            })
    })

    return router
}
