const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const Product = require('./product');

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id ? new mongodb.ObjectID(id) : id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then(result => {
                console.log("user added successfully");
            })
            .catch(err => {
                console.log("error", err);
            })
    }

    addToCart(product) {
        const updateProductIndex = this.cart.item.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        const updatedCartItems = [...this.cart.item];
        let newQuantity = 1;

        if (updateProductIndex >= 0) {
            newQuantity = this.cart.item[updateProductIndex].quantity + 1;
            updatedCartItems[updateProductIndex].quantity = newQuantity;
        }
        else {
            updatedCartItems.push({ productId: product._id, quantity: 1 });
        }
        const updatedCart = { item: updatedCartItems };
        const db = getDb();
        return db.collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.item.map(i => {
            return i.productId;
        });
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.item.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                })
            });
    }

    deleteItemFromCart(product) {
        const updatedItems = this.cart.item.filter(i => {
            return i.productId.toString() !== product._id.toString();
        });
        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: this._id },
                {
                    $set: { cart: { item: updatedItems } }
                });
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
        .then(products => {
            return db.collection('orders').insertOne(
                {
                    user: { userId: this._id, username: this.username, email: this.email },
                    items: products
                })
                .then(result => {
                    console.log("Order placed successfully");
                    this.cart = { item: [] };
                    return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: this.cart } });
                })
                .then(result => {
                    console.log("users cart cleaned successfully..");
                })
        });
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({"user.userId": this._id}).toArray();
    }

    static findById(id) {
        console.log("fetching user");
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectID(id) })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;