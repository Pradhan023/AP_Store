import e from "express";
import { protectedroute } from "../middleware/auth.middleware";
import { checkoutSuccess, createCheckoutSession } from "../controller/payment.controller";
const route = e.Router();


route.post("/create-checkout-session",protectedroute,createCheckoutSession)
route.post("/checkout-success",protectedroute,checkoutSuccess)

export default route