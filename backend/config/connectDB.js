const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true
        });
        console.log("Mongodb database connected!");
    }
    catch(error){
        console.log(`Error: ${error}`);
        process.exit();
    }
}

module.exports = connectDB;