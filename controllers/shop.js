const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      res.render('shop/cart', {
        products: cart,
        pageTitle: 'Shop Cart',
        path: '/'
      });
    })
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log("product added to cart successfully .. ");
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    })

};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  });
  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.deleteCartItem = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id)
    .then(product => {
      return req.user.deleteItemFromCart(product);
    })
    .then(result => {
      console.log("product deleted from cart successfully .. ");
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
    });
}

exports.postCreateOrder = (req, res, next) =>{
    req.user.addOrder()
    .then(result=>{
      res.redirect("/products");
    });
}