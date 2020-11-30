const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
  product.save()
  .then(result => {
    console.log("=======product added succesfully========\n", result);
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    });
};

exports.getEditProduct = (req, res, next) => {
  const isEdit = req.query.edit;
  if (!isEdit) {
    return res.redirect('/');
  }
  const id = req.params.productId;
  Product.findById(id)
    .then(product => {
      res.render('admin/edit-product', {
        product: product,
        pageTitle: 'Edit Page for ' + product.title,
        path: '/',
        editing: true
      });
    }).catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  console.log("--------in post edit =-----------");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.productId;
  const product = new Product(title, price, description, imageUrl, id, req.user._id);
  product.save()
    .then(result => {
      res.redirect('/admin/products');
      console.log("product updated !!!");
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.productId)
    .then(result => {
      res.redirect('/admin/products');
      console.log("..........product deleted successfully............");
    })
    .catch(err => {
      console.log(err);
    });
};

