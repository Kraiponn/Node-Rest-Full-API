const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Product getting.'
    });
});

router.get('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Product getting.',
        productId: req.params.productId
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Product postting.',
        body: req.body
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'Product deleted product successfully.',
        productId: req.params.productId
    });
});

module.exports = router;