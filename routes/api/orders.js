const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'order getting.'
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'order getting.',
        orderId: req.params.orderId
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'order postting.'
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'order deleted order successfully.',
        orderId: req.params.orderId
    });
});

module.exports = router;