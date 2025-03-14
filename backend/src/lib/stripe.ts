import Stripe from "stripe";
import dotenv from 'dotenv'

dotenv.config();

export const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as any, // Use type assertion if needed
  typescript: true,
});