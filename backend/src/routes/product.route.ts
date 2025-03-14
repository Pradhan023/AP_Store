import e from "express";
import { createProductController, deleteProductController, getAllProductsController, getFeaturedProductsController, getProductsbyCategoryController, getRecommendedProductsController, toggleFeaturedProductController } from "../controller/product.controller";
import { adminroute, protectedroute } from "../middleware/auth.middleware";
import upload from "../lib/multer";

const route = e.Router();


route.get("/",protectedroute,adminroute,getAllProductsController)
route.get("/featuredproducts",getFeaturedProductsController)
route.get("/recommendation",getRecommendedProductsController)
route.get("/category/:category",getProductsbyCategoryController)
route.post("/",protectedroute,adminroute,upload.single("image"),createProductController)
route.delete("/:id",protectedroute,adminroute,deleteProductController)
route.patch("/:id",protectedroute,adminroute,toggleFeaturedProductController)

export default route