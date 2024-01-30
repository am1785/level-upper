var mongoose = require('mongoose');
// const { MongoClient, ObjectId } = require('mongodb');
const Db = process.env.COSMOS_URI;
// const client = new MongoClient(Db);

var _db;

module.exports = {
  connectToServer: function (callback) {
      mongoose.connect(Db, {
        retryWrites: false
      })
  .then(() => console.log('Connection to CosmosDB successful'))
  .catch((err) => {console.error(err); return callback(err)});
  },

  getDb: function () {
    return _db;
  },
};