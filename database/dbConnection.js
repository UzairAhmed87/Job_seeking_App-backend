import mongoose from "mongoose";
export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"JobSeekingApp",

    }).then(()=>console.log("Connected to Database")
    ).catch((err)=>console.log(`Error connecting to databse ${err}`)
    )
}