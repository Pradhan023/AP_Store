import mongoose from "mongoose";

interface Iproducts{
    product:mongoose.Types.ObjectId;
    quantity:Number;
    price:Number;
}

interface IOrder {
    user:mongoose.Types.ObjectId;
    product:Iproducts[];
    totalAmount:Number;
    stripeSessionId:string;
}

const Orderschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    stripeSessionId: {
        type: String,
        unique: true,
    },
},
{ timestamps: true }
);

const Order = mongoose.model<IOrder>("Order",Orderschema);

export { Order,Iproducts}