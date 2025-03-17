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
import fs from 'fs'


const app = express();


const PORT = process.env.PORT || 3000;

// Create __dirname equivalent for ES modules
const __dirname = path.resolve();


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


// Serve static files and handle client-side routing in production
if (process.env.NODE_ENV === "production") {
    // Log the current directory to help with debugging
    console.log('Current directory:', __dirname);
    
    // Try a different path resolution approach for Render deployment
    let frontendPath;
    
    // Check if we're on Render (based on the error path you shared)
    if (__dirname.includes('/opt/render/project')) {
      // On Render, the path might be structured differently
      frontendPath = path.join(__dirname, 'frontend', 'dist');
    } else {
      // Local development path
      frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
    }
    
    console.log('Using frontend path:', frontendPath);
    
    // Verify if the directory exists
    
    if (!fs.existsSync(frontendPath)) {
      console.error(`Frontend path does not exist: ${frontendPath}`);
    }
    
    // Serve static files
    app.use(express.static(frontendPath));
    
    // Handle client-side routing
    app.get('*', (req, res) => {
      const indexPath = path.join(frontendPath, 'index.html');
      console.log('Attempting to serve:', indexPath);
      
      // Check if the file exists before sending
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`Index file not found at: ${indexPath}`);
        res.status(404).send('Build files not found. Make sure you have built the frontend.');
      }
    });
  }

app.listen(PORT,()=>{
    console.log(`Sever is live on Port ${PORT}`)
    connection()
})