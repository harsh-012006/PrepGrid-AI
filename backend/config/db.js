const mongoose = require("mongoose");

require('dotenv').config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
        });
        console.log("connected sucessfully!!! => MongoDB");
        
    }catch(err){
        console.log("MongoDB connection error:", err.message);
        console.log("Server will continue without database. Features requiring DB may not work.");
    }
};

module.exports = connectDB; 