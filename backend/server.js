import dotenv from 'dotenv'
dotenv.config();

import express from "express";
import authroutes from "./routes/auth.route.js";
import productroutes from "./routes/product.route.js";
import cartroutes from "./routes/cart.route.js"
import couponroutes from "./routes/coupon.route.js"
import paymentroutes from "./routes/payment.route.js"
import analyticsroutes from "./routes/analytics.route.js"
import connection from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path';


const app = express();


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(); //  is used to get the current working directory, which is the directory containing the current file returns the absolute path

// CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL, // Your frontend URL
    credentials: true, // This allows cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }));

// middleware
app.use(express.json()); // allow you to parse json from req.body
app.use(cookieParser());  //allow you to parse cookies

// routes
app.use('/api/auth',authroutes);
app.use('/api/products',productroutes);
app.use('/api/cart',cartroutes);
app.use('/api/coupons',couponroutes);
app.use('/api/payment',paymentroutes);
app.use('/api/analytics',analyticsroutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend/frontend/dist"))); // this will serve the static files from the build folder ,

	app.get("*", (req, res) => { // * means any route (wild card  ) , this will send the index.html file to the client , other than the routes defined above , only frontend route
		res.sendFile(path.resolve(__dirname, "frontend/frontend/dist", "index.html")); // this will send the index.html file to the client and this is the path to the index.html file 
	});
}



app.listen(PORT,()=>{
    console.log(`Sever is live on Port ${PORT}`)
    connection()
})