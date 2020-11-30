const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const app = express();
const mongoConnect = require('./util/database').mongoConnect;
const getDb = require('./util/database').getDb;
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) =>{
    User.findById("5fc38b55a8fd9a3ce077bbd0")
    .then(user=>{
        req.user = new User(user.username, user.email, user.cart, user._id);
        next();
    })
    .catch(err=>{
        console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() =>{
    app.listen(3000);
});


