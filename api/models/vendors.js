import mongoose from "mongoose";

const vendorsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
}, {
    collection: "vendorscollection",
});

const vendorsModel = mongoose.model("Vendors", vendorsSchema);

export default vendorsModel;