var mongoose = require('mongoose');
// const { MongoClient, ObjectId } = require('mongodb');
const Db = process.env.COSMOSDB_CONNECTION_STRING;
// const client = new MongoClient(Db);

// 5/6/2024

// var _db;

// module.exports = {
//   connectToServer: function (callback) {
//       mongoose.connect(Db, {
//         retryWrites: false
//       })
//   .then(() => console.log('Connection to CosmosDB successful'))
//   .catch((err) => {console.error(err); return callback(err)});
//   },

//   getDb: function () {
//     return _db;
//   },
// };

// trying caching

if (!Db) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(Db, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;