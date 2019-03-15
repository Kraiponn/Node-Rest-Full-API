const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Orders = require('../../models/orderModel');

router.get('/', (req, res, next) => {
    Orders.find()
    .populate('product', 'name price')
    .exec()
    .then(docs => {
        //console.log(docs);
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    quantity: doc.quantity,
                    product: doc.product,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000'
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

router.get('/:orderId', (req, res, next) => {
    const _id = req.params.orderId;
    Orders.findById(_id)
    .select(" name price _id ")
    .populate('product')
    .exec()
    .then(doc => {
        //console.log(docs);
        if(doc){
            res.status(200).json({
                _id: doc._id,
                quantity: doc.quantity,
                product: doc.product,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000'
                }
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provide ID'})
        }
    })
    .catch(err => {
        //console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    const order = new Orders({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });

    order
    .save()
    .then(result => {
       res.status(201).json({
           message: 'Created order successfully.',
           createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                requst: {
                    type: 'POST',
                    url: 'http://localhost:3000/' + result._id
                }
           }
       });     
    })
    .catch(err => {
        //console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:_id', (req, res, next) => {
    Orders.deleteOne({_id: req.params._id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                orderDeleted: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: 'DELETE',
                        url: 'http://localhost:3000/' + result._id
                    }
                }
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

router.put('/:id', (req, res) => {
    const id = req.params.id;
    Orders.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Updated order successfully',
                orderUpdated: {
                    type: 'PUT',
                    url: 'http://localhost:3000/' + result._id,
                    product: result
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;