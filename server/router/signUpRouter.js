const router = require('express').Router();
const signupV1 = require('../version/signupV1.js')

const layout = require('../views/signupView.js');
router.use(layout)

router.use("/v1", signupV1);

module.exports = router;