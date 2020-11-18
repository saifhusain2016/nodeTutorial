const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, metaData]) => {
      console.log("-----------------------");
      console.log("successfully fetched data from database");
      console.log("-----------------------");
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    }).catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.fetchbyId(id)
    .then(([result, data]) => {
      console.log("product deteails fetched successfully ",id, " ", result[0].id);
      console.log(result[0]);
      console.log("-----------------------------------------------------");
      res.render('shop/product-detail', {
        product: result[0],
        pageTitle: result[0].title,
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCartProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const matchedProduct = cart.products.find(item => item.id === product.id);
        if (matchedProduct) {
          cartProducts.push({ product: product, qty: matchedProduct.qty });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Shop',
        path: '/',
        cartProducts: cartProducts,
        totalPrice: cart.price
      })
    });

  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  Product.fetchbyId(id, product => {
    console.log(product);
    Cart.addProduct(id, product.price);
  })
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.deleteCartItem = (req, res, next) => {
  Cart.getCartProducts(cart => {
    const id = req.body.productId;
    Product.fetchbyId(id, product => {
      Cart.deleteProduct(id, product.price);
      res.redirect('/cart');
    });
  });
}