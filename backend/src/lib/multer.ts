import { Request } from "express";
import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"backend/uploads/")
    },
    filename: function(res,file,cb){
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)  // this will generate the file name and this file will upload to uploads folder with destination fun
        )
    }
});


const checkFilterfile = (req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new Error("not an image ! Please uplaod an image"))
    }
}


// multer  middleware
export default multer({
    storage : storage,
    fileFilter : checkFilterfile,
    limits:{
        fileSize: 5*1024*1024 //5mb 
    }
})