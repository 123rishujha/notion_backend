const express = require("express");
const cors = require("cors");

//route-files
const { userRouter } = require("./Routes/route.user");
const { bookRouter } = require("./Routes/route.book");

//connection
const { connection } = require("./Config/connection");

//our custorm middlewares;
const { authMiddleware } = require("./Middleware/authorise.middleware");


const app = express();


app.use(express.json());
app.use(cors());


//auth/signin
app.use("/auth",userRouter);
app.use("/book",bookRouter); // all the things for book -> chapter/page;

const port = process.env.PORT || 8080
app.listen(8080,async ()=>{
    try{
        await connection;
        console.log("connected to database");
    }
    catch(err){
        console.log("not connected to database");
    }
    console.log(`running on port ${port}`);
})

