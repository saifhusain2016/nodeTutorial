const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

const getCart = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err || fileContent.length===0) {
      cb( { products: [], price: 0} );
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice){
    getCart(cart =>{
        const existingProductIndex = cart.products.findIndex(p=> p.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        if(existingProduct){
           updatedProduct = { ...existingProduct };
           updatedProduct.qty = updatedProduct.qty + 1;
           cart.products[existingProductIndex] = updatedProduct;
        }
        else{
          updatedProduct =  { id: id, qty: 1};
          cart.products = [ ...cart.products, updatedProduct ];
        }
        cart.price = cart.price + +productPrice;
        fs.writeFile(p, JSON.stringify(cart, null , '\t'), err=>{
            console.log(err);
        });
    });
  }

};
