const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    res.status(200).send('OK, hello ' + req.session.userID);
})
router.get('/login', function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    res.render('authenticate', { err: '', isReg: false, loginSuccess: true });
});
module.exports = router;