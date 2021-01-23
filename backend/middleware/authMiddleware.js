const jwt = require('jsonwebtoken')
const config = require('config')

const jwtSecret = config.get('jwtSecret');

function authMiddleware(func) {
    return (req, res) => {
        var token = req.headers.authtoken;
        // console.log(req.headers.authtoken);
        // console.log(token)
        if (!token) {
            return res.status(500).json({ msg: 'no auth token' });
        }

        jwt.verify(token, jwtSecret, (e, midRes) => {
            if (e)
                return res.status(500).json({ msg: 'not authorised ' })
            func(req, res, midRes)
        });
    };
}

module.exports = authMiddleware