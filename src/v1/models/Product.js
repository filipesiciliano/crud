'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        unique: true
    },
    active: Boolean,
}, options)

// Price Getter
ProductSchema.path('price').get(function(num) {
  return (num / 100).toFixed(2)
})

// Price Setter
ProductSchema.path('price').set(function(num) {
  return num * 100
})

ProductSchema.set('toJSON', {
    getters: true,
    timestamps: true,
    transform: function (doc, ret, options) {
        // remove the _id of every document before returning the result
        delete ret._id
        delete ret.active
        delete ret.__v
        return ret
    }
})

export default mongoose.connection.model('Product', ProductSchema)
