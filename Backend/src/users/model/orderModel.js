const mongoose = require('mongoose'); // Erase if already required
const orderItemSchema = require('./orderItemModel');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    totalPrice: {
        type: Number,
        required:true,
        unique:true,
        index:true,
    },
    orderStatus: {
        type: String,
        enum: ['Canceled', 'Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    shippingMethod: {
        type: String,
        enum: ['paypal'],
        default: 'paypal'
    },
    orderItems: {
        type: [orderItemSchema],
        require: true,
        default: []
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    removed: {
        type: Boolean,
        default: false
    },
    created: {
        type: Number
    },
    updated: {
        type: Number
    }
});

orderSchema.pre("save", async function (next) {
    this.created = new Date().getTime();
    this.updated = new Date().getTime();
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);