const mongoose=require('mongoose')
const config=require('config')
console.log('entering to db')

const db=config.get("mongoURI")

const connectDB=async()=>{

    try{
        console.log("entering to before db connect")
        await mongoose.connect(db,);
        console.log("entering to after db connect")

        console.log("MongoDB Connected...")
    }catch(e){
        console.log(e.message)
        //Exit process with failure
        process.exit(1)
    }
}

module.exports=connectDB;