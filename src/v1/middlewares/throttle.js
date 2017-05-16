'use strict'

import config from '../../../config'
import Throttle from '../models/Throttle'

export default function (req, res, next) {

    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress

    // this check is necessary for some clients that set an array of IP addresses
    ip = (ip || '').split(',')[0]

    Throttle
        .findOneAndUpdate({ip: ip},
            { $inc: { hits: 1 } },
            { upsert: false })
        .exec(function(error, throttle) {
            if (error) {
                res.sendStatus(500)
                return next(error)
            } else if (!throttle) {
                throttle = new Throttle({
                    createdAt: new Date(),
                    ip: ip
                })
                throttle.save(function(error, throttle) {
                    if (error) {
                        res.sendStatus(500)
                        return next(error)
                    } else if (!throttle) {
                        return res.status(500).json({
                            error: 'Erro ao checar o limite de acessos.'
                        })
                    }

                    respondWithThrottle(req, res, next, throttle)
                })
            } else {
                respondWithThrottle(req, res, next, throttle)
            }
        })

    function respondWithThrottle(req, res, next, throttle) {
        const timeUntilReset = (config.rateLimit.ttl * 1000) - (new Date().getTime() - throttle.createdAt.getTime())
        const remaining =  Math.max(0, (config.rateLimit.max - throttle.hits))

        res.set('X-Rate-Limit-Limit', config.rateLimit.max)
        res.set('X-Rate-Limit-Remaining', remaining)
        res.set('X-Rate-Limit-Reset', timeUntilReset)
        req.throttle = throttle
        if (throttle.hits < config.rateLimit.max) {
            return next()
        } else {
            return res.status(429).json({
                error: 'Limite de acessos atingido. Por favor aguarde e tente novamente.'
            })
        }
    }
}
