const jwt = require('jsonwebtoken');
const key = require('../config/key');

module.exports = (req, res, next)  => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, key.JWT_KEY);
        // console.log('token ', token);
        // console.log("body ", req.body.token);
        req.userToken = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message: 'Auth failed.'
        });
    }
}