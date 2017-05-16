'use strict'

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config.json'

const Schema = mongoose.Schema

const options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    active: Boolean
}, options)

UserSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, config.bcrypt.saltRounds)
        next()
    } else {
        return next()
    }
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.set('toJSON', {
    getters: true,
    timestamps: true,
    transform: function (doc, ret, options) {
        // remove the _id of every document before returning the result
        delete ret._id
        delete ret.password
        delete ret.active
        delete ret.__v
        return ret
    }
})

export default mongoose.connection.model('User', UserSchema)
