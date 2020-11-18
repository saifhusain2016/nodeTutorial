const fs = require('fs');
const path = require('path');
const { deleteProduct } = require('./cart');
const Cart = require('./cart');
const db = require('../util/database');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      if (fileContent.length) {
        const content = JSON.parse(fileContent);
        cb(content);
      }
      else cb([]);
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    if (id)
      this.id = id.toString();
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute("insert into products (title, price, description, imageUrl) VALUES(?, ?, ?, ?)",
    [this.title, this.price, this.description,  this.imageUrl]
    );
  }

  static delete(id) {
    getProductsFromFile(products => {
      const deletingProduct = products.find(item => item.id === id);
      const updatedProducts = products.filter(item => item.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts, null, '\t'), err => {
        console.log(err);
        if (!err) {
          Cart.deleteProduct(id, deletingProduct.price);
        }
      });
    });
  }

  static fetchAll() {
    return db.execute("select * from products");
  }

  static fetchbyId(id) {
    return db.execute("select * from products where products.id=?",[id]);
  }

};
