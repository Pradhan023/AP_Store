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
import fs from 'fs';


const app = express();


const PORT = process.env.PORT || 3000;


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


// For production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
  
  // Try multiple potential frontend paths
  const possiblePaths = [
    path.join(__dirname, 'frontend', 'dist'),
    path.join(__dirname, '..', 'frontend', 'dist'),
    path.join(__dirname, '..', '..', 'frontend', 'dist'),
    path.join(process.cwd(), 'frontend', 'dist')
  ];
  
  // Find first path that exists
  let frontendPath = null;
  for (const pathToCheck of possiblePaths) {
    console.log(`Checking if path exists: ${pathToCheck}`);
    if (fs.existsSync(pathToCheck)) {
      console.log(`Found frontend at: ${pathToCheck}`);
      frontendPath = pathToCheck;
      break;
    }
  }
  
  if (frontendPath) {
    // Serve static files
    app.use(express.static(frontendPath));
    
    // Handle client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.log('WARNING: Frontend build not found, API-only mode');
    app.get('*', (req, res) => {
      res.send('Frontend not found. API endpoints are available at /api/*');
    });
  }
}

app.listen(PORT,()=>{
    console.log(`Sever is live on Port ${PORT}`)
    connection()
})