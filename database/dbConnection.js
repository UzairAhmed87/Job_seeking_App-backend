import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_STACK_JOB_SEEKING WEBSITE",

    }).then(()=>console.log("Connected to Database")
    ).catch((err)=>console.log(`Error connecting to databse ${err}`)
    )
}