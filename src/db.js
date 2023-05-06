const { MongoClient } = require("mongodb");
const { default: mongoose } = require("mongoose");

let client;

// const initializeDbConnection = async () => {
//   client = await MongoClient.connect(process.env.DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// const getDbConnection = (dbName) => {
//   const db = client.db(dbName);
//   return db;
// };

const connectDB = () => {
  if(mongoose.connections[0].readyState){
    console.log('Already connected.')
    return;
  }
  mongoose.connect("mongodb://hadi:Ha123456@94.101.179.112:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    "auth": {"authSource": "admin"},
    "user": `hadi`,
    "pass": `Ha123456`,
    "dbName": `MultiAutomation`
  }, err => {
    if (err) throw err;
    console.log(`Connected to MongoDB. DB: MultiAutomation`)
  });
  // ddd();
}

module.exports = { connectDB };
