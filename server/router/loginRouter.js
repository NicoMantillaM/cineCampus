const router = require('express').Router();
const loginV1  = require('../version/loginV1');
const layout = require('../views/loginView');

router.use(layout)
router.use("/v1", loginV1)

module.exports = router;