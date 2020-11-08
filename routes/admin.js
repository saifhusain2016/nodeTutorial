const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('../util/path'); 

router.use(bodyParser.urlencoded({extended: false}));

router.use('/add-product', (req, res, next) =>{
    res.sendFile(path.join(rootDir,'views','add-product.html'));
});

router.post('/product',(req, res, next)=>{
    console.log(JSON.parse(JSON.stringify(req.body)));
    res.redirect('/');
});

module.exports = router;