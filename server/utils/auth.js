const jwt = require('jsonwebtoken');

const secret = 'mysecret';
const expiration = '2h';

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id }

        return jwt.sign({ data: payload }, secret, {expiresIn: expiration });
    },
    authMiddleware: function({ req }) {
        //allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        //separate 'bearer' from the '<token value>'
        if (req.headers.authorization) {
            token = token
            .split(' ')
            .pop()
            .trim();
        }
        // if no token return the request 
        if (!token) {
            return req;
        }
        // decode and attach the user data to the request object
        try {
            const { data } = jwt.verify(token, secret, {maxAge: expiration });
            req.user = data;
        }catch {
            console.log('Invalid token');
        }

        // return updated request object
        return req;
    }
};