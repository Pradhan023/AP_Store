import { Request, Response } from "express";
import { Product } from "../model/product.model";
import { redis } from "../lib/redis";
import cloudinary from "../lib/cloudinary";
import fs from "fs";

interface IBody {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}



export const getAllProductsController = async (
  req: Request,
  res: Response
):Promise<Response | void> => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
        success:true,
        data:products
    })
  } catch (err: unknown) {
    console.log("Error in getting all products", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};

export const getFeaturedProductsController = async (req:Request , res:Response):Promise<Response | void>=>{
  try{
    // first of all check if data is in redis for faster response
    let cachedProducts = await redis.get("featured_Products");
    if(cachedProducts){
      return res.status(200).json({
        success:true,
        data:JSON.parse(cachedProducts) //redis data is in json string format so we need to parse it to object
      })
    }

    // if data is not in redis then fetch from db and store in redis
    let featuredProducts = await Product.find({isFeatured:true}).lean(); //lean() is used to convert mongoose object to normal javascript object ,which is good for performance without any of the Mongoose document methods, such as save(), remove(), etc.
    if(!featuredProducts.length){
      return res.status(404).json({
        success:false,
        message:"No featured products found"
      })
    }

    // now store data this data which is fetched from db in redis which will be used in next request for faster response
    await redis.set("featured_Products",JSON.stringify(featuredProducts)) //store data in redis in json string format because redis only store string format data
    return res.status(200).json({
      success:true,
      data:featuredProducts
    })
  }
  catch(err){
    console.log(err)
    return res.json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

export const createProductController = async(req:Request<{},{},IBody>,res:Response):Promise<Response | void>=>{
  try{
    const{name,description,price,category} = req.body;
    const image = req?.file?.path;  // req.file.path is used to get the path of the uploaded image
    
    // upload image in cloudinary
    if(!image){
      return res.status(400).json({
        success:false,
        message:"Image is required"
      })
    }
    const {secure_url,public_id} = await cloudinary.uploader.upload(image,{folder:"products"}); 
    fs.unlinkSync(image); // delete image from local storage after uploading in cloudinary from upload folder
    const newcreate = await Product.create({
      name,
      description,
      price,
      image:{ url:secure_url,publicId:public_id },
      category
    })

    return res.status(201).json({
      success:true,
      data:newcreate
    })
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
  }
}

export const deleteProductController = async(req:Request<{id:string}>,res:Response):Promise<Response | void>=>{
  try{
    const{id} = req.params;
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }

    // delete image from cloudinary
    await cloudinary.uploader.destroy(`products/${product.image?.publicId}`);
    // delete product from db
    await Product.findByIdAndDelete(id);
    return res.status(200).json({
      success:true,
      message:"Product deleted successfully"
    })
      }
  catch(err:any){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
      error:err.message
    })
  }
}

export const getRecommendedProductsController = async (req:Request , res:Response):Promise<Response | void>=>{
  try{
    const recommendedProduct = await Product.aggregate([
      {
        // $sample: This stage randomly selects 3 documents (products) from the collection.
        $sample:{size:3}
      },
      {
        // $project: This stage specifies the fields to include in the output document.
        $project:{
          _id:1,
          name:1,
          description:1,
          price:1,
          image:1
        }
      }
    ]);

    return res.status(200).json({
      success:true,
      data:recommendedProduct
    })
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
  }
}

export const getProductsbyCategoryController = async(req:Request,res:Response):Promise<Response | void>=>{
  try{
    const{category} = req.params;
    const product = await Product.find({category}).lean(); //lean() is used to convert mongoose object to normal javascript object ,which is good for performance , resulting object will not have any of the Mongoose document methods, such as save(), remove(), etc. if we dont want to modify the original object then we can use lean() method

    return res.status(200).json({
      success:true,
      data:product    
    })
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
  }
}

export const toggleFeaturedProductController = async(req:Request<{id:string}>,res:Response):Promise<Response | void>=>{
  try{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({
        success:false,
        messgage:"Product not found"
      })
    }
    product.isFeatured = !product.isFeatured;  // toggle isFeatured field with true if its false and false if its true
    await product.save(); // save updated product in db
    await updateCachedFeaturedProducts(); // update cached featured products in redis
    return res.status(200).json({
      success:true,
      data:product
    })
  }
  catch(err:any){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
      error:err.message
    })
  }
}

async function updateCachedFeaturedProducts(){
  try {
    // lean() is used to convert mongoose object to normal javascript object
    const featuredProduct = await Product.find({isFeatured:true}).lean();
    await redis.set("featured_Products",JSON.stringify(featuredProduct));
  } catch (error) {
    console.log("Error in updating cached featured products", error);
  }
}