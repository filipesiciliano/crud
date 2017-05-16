'use strict'

import mongoose from 'mongoose'
import config from '../../../config.json'

const Schema = mongoose.Schema

const ThrottleSchema = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: config.rateLimit.ttl // (60 * 10), ten minutes
    },
    ip: {
        type: String,
        required: true,
        trim: true
    },
    hits: {
        type: Number,
        default: 1,
        required: true,
        max: config.rateLimit.max, // 600
        min: 0
    }
})

ThrottleSchema.index({ createdAt: 1 }, { expireAfterSeconds: config.rateLimit.ttl })
export default mongoose.connection.model('Throttle', ThrottleSchema)
