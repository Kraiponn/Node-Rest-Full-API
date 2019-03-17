const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const key = require('../../config/key');

const router = express.Router();

const User = require('../../models/userModel');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(result => {
            if(result.length >= 1){
                return res.status(409).json({
                    message: 'Email exists'
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
            
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User added.'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if(result){
                    console.log("Key ", key.JWT_KEY);
                    const token = jwt.sign(
                        {
                            sub: user[0].email,
                            userId: user[0]._id
                        },
                        key.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );

                    return res.status(200).json({
                        message: 'Auth successfull.',
                        token: token
                    });
                }

                res.status(401).json({
                    message: 'Auth failed.'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/', (req, res, next) => {
    User.find()
        .select('_id email password')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                usersList: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        password: doc.password
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})


// Find user by user id
router.get('/:userId', (req, res, next) => {
    User.findById({_id: req.params.userId})
        .select('_id email password')
        .exec()
        .then(docs => {
            res.status(200).json({
                _id: docs._id,
                email: docs.email,
                password: docs.password
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

// Delete use at ID
router.delete('/:userId', (req, res, next) => {
    User.findByIdAndRemove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted successfully'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;