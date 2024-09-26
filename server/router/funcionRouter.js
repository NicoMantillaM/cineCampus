const router = require('express').Router();
const funcionV1 = require('../version/funcionV1.js')

const layout = require('../views/funcionView.js');
router.use(layout)

router.use("/v1", funcionV1);

module.exports = router;