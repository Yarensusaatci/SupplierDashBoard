import mongoose from "mongoose";

const ordersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cardItem: {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products' // ParentProduct koleksiyonuna referans
        },
        variantId: mongoose.Schema.Types.ObjectId,
        series: String,
        item_count: Number,
        quantity: Number,
        cogs: Number,
        price: Number,
        vendor_margin: Number,
        order_status: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    payment_at: Date,
    month: String,
    year: String,
}, {
    collection: "orders"
});

const ordersModel = mongoose.model('Orders', ordersSchema);

export default ordersModel;