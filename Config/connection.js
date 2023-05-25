const mongoose = require("mongoose");
require("dotenv").config();

let url=process.env.mongoURL
// const connection = mongoose.connect(process.env.mongoURL);
const connection = mongoose.connect(`${url}`,{useNewUrlParser:true},{useUnifiedTopology:true});

module.exports = {
    connection
}

