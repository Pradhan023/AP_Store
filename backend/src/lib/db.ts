import mongoose from "mongoose";

const connection = async():Promise<void>=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`Mongodb connetcted : ${connect.connection.host}`)
    }
    catch(err:any){
        console.log(`ERROR CONNECTING TO MONGODB  ${err.message}`);
        process.exit(1);
    }
}

export default connection