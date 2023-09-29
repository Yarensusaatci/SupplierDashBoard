import mongoose from "mongoose";

const productsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendors' // Vendor koleksiyonuna referans
    }
}, {
    collection: "parent_products",
});

const productsModel = mongoose.model('Products', productsSchema);

export default productsModel;