const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send({message: 'Wee did it'})
});

module.exports = router;