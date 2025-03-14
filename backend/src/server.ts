import dotenv from 'dotenv'
import express,{Express} from "express";
import authroutes from "./routes/auth.route";
import productroutes from "./routes/product.route";
import cartroutes from "./routes/cart.route"
import couponroutes from "./routes/coupon.route"
import paymentroutes from "./routes/payment.route"
import analyticsroutes from "./routes/analytics.route"
import connection from './lib/db';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path';

dotenv.config();

const app:Express = express();


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(); //  is used to get the current working directory, which is the directory containing the current file returns the absolute path

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
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

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../../../frontend/frontend/dist'))); // this will serve the static files from the build folder
    app.get('*',(req,res)=>{ // * means any route (wild card  ) , this will send the index.html file to the client , other than the routes defined above , only frontend route 
        res.sendFile(path.resolve(__dirname,'../../../frontend/frontend/dist/index.html')) // this will send the index.html file to the client
    })
}

app.listen(PORT,():void=>{
    console.log(`Sever is live on Port ${PORT}`)
    connection()
})