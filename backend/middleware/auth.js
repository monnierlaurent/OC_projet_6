const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIs@InR5cCI6IkpXVCJ9.eyJz#dWIiOiIxMjM0NTY3ODkwIiw/ibmFtZSI6IkpvaG4g&RG9lIiwiYWRtaW4iOnRydWV9.TJVA95Or/M7E2cBab30RM@HrHDcEfxjoYZgeFONFh7HgQ');

        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'user ID non valable ! ';
        } else {
            next();
        };

    } catch (error) {
        res.status(401).json({ error: error | 'requette non authentifiée !!' })
    };
};