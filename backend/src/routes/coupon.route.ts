import e from "express";
import { protectedroute } from "../middleware/auth.middleware";
import { getCouponController, validateCouponController } from "../controller/coupon.controller";

const route = e.Router();

route.get("/", protectedroute , getCouponController)
route.post("/validate", protectedroute , validateCouponController)

export default route