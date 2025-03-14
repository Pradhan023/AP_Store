import e from "express";
import { protectedroute } from "../middleware/auth.middleware";
import { addProductToCartController, getProductfromCartController, removeProductfromCartController, updateQuantityfromCartController } from "../controller/cart.controller";

const route = e.Router();

route.get('/',protectedroute,getProductfromCartController)
route.post('/',protectedroute,addProductToCartController)
route.delete('/',protectedroute,removeProductfromCartController)
route.put('/:id',protectedroute,updateQuantityfromCartController)

export default route