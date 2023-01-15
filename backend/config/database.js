const mongoose = require("mongoose");
const config = require ("./config")

const connectDatabase = () => {
  mongoose
    .connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
