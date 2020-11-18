const { fetchbyId } = require('../models/product');
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
  const product = new Product(null, title, imageUrl, description, price);
  product.save()
  .then(()=>{
    res.redirect('/');
  })
  .catch(err=>{
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const isEdit = req.query.edit;
  if(!isEdit){
      return res.redirect('/');
  }
  console.log("-------------edit is ", isEdit);
  const id = req.params.productId;
  Product.fetchbyId(id, product => {
    //console.log("--------- product is ", product);
    res.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit Page for ' + product.title,
      path: '/',
      editing: true
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  console.log("--------in post edit =-----------");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.productId;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
};


exports.postEditProduct = (req, res, next) => {
  console.log("--------in post edit =-----------");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.productId;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("deleting product with id ", req.body.productId);
  Product.delete(req.body.productId);
  res.redirect('/admin/products');
};

