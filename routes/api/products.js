const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        //cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../../models/productModel');

router.get('/', (req, res, next) => {
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs => {
        //console.log(docs);
        res.status(200).json({
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        //console.log(err);
        res.status(500).json({error: err});
    });
});

router.get('/:productId', (req, res, next) => {
    const _id = req.params.productId;
    Product.findById(_id)
    .select(" name price _id ")
    .exec()
    .then(docs => {
        //console.log(docs);
        if(docs){
            res.status(200).json(docs);
        }else{
            res.status(404).json({message: 'No valid entry found for provide ID'})
        }
    })
    .catch(err => {
        //console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', upload.single('productImage') , (req, res, next) => {
    console.log(req.file);
    const p = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    p.save()
    .then(result => {
       //console.log(doc);
       const response = {
            _id: result._id,
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/' + result._id
            }
       }  

       res.status(201).json(response);
    })
    .catch(err => {
        //console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:_id', (req, res, next) => {
    const id = req.params._id;
    Product.remove({_id: req.params._id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted product id ' + result.id + ' successfully.',
                response: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productId', (req, res) => {
    const id = req.params.productId;
    Product.findOneAndUpdate({_id: id}, req.body)
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.put('/:productId', (req, res) => {
    const id = req.params.productId;
    Product.update({_id: id}, {$set: req.body})
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'Updated product id ' + id + ' successfully.'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;