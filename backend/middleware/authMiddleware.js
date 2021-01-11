const config = require('config');
const jwt = require('jsonwebtoken');

function authenticate(req, res, next){
    const xAuthToken = req.header('x-auth-token');

    if (!xAuthToken) {
        //unauthorized
        res.status(401).json({msg : 'unauthorized'});
    }
    try{
        const decodedToken = jwt.verify(token, config.get('jwtSecret'));
    
        req.status = decodedToken;
        next();
        
    }catch(e){
        res.status(400).json({msg: 'bad token'});
    }
}

module.exports = authenticate;