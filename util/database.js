const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('')
    .then(client => {
        console.log("------------------------------");
        console.log("Connected to Database !!!");
        console.log("------------------------------");
        _db = client.db();
        callback();
    }).catch(err => {
        console.log("----------Error---------------");
        console.log(err);
        console.log("------------------------------");
        throw err;
    });
}

const getDb = () =>{
    if(_db)
        return _db;
    else
        throw "No Database Found !";
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;
