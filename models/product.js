const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectID(id) : id;
        this.userId = userId ? new mongodb.ObjectID(userId): userId;
    }

    save() {
        const db = getDb();
        let dbOp = db;
        if (this._id) {
            dbOp =  db.collection('products').updateOne({ _id: this._id }, { $set: this });
        }
        else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then(result => {
            console.log("new product added/updated");
        })
        .catch(err => {
            console.log(err);
        });
    }

    static deleteById(id){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectID(id)})
        .then(result => {
            console.log("----------- deleting product -----------");
        }).catch(err => {
            console.log(err);
        });
    }

    static findAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(result => {
                // console.log("-----------all products -----------");
                // console.log(result);
                // console.log("-----------------------------------");
                return result;
            }).catch(err => {
                console.log(err);
            });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectID(id) })
            .next()
            .then(result => {
                console.log("-----------one product found !!! -----------");
                console.log(result);
                console.log("-----------------------------------");
                return result;
            })
            .catch(err => {
                console.log((err));
            });
    }
}

module.exports = Product;