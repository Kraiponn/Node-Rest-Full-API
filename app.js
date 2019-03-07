const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const productRouter = require('./routes/api/products');
const orderRouter = require('./routes/api/orders');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method === 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods',
            "GET", 'PUT', 'PATCH', 'POST', 'DELETE'
        );

        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRouter);
app.use('/orders', orderRouter);


//---- Handle error
 app.use((req, res, next) => {
     const error = new Error('Not Found');
     error.status = 404;
     next(error);
 });

 app.use((error, req, res, next) => {
     res.status(error.status || 500);
     res.json({
         error: {
             message: error.message
         }
     });
 });

module.exports = app;