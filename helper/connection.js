// connection.js
const mongoose = require("mongoose");

const connection = "mongodb://localhost:27317/bitexen_task";

const connectDb = () => {
 return mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

module.exports = connectDb;