const router = require('express').Router();
// const cookieParser = require('cookie-parser')
const reservaV1 = require('../version/reservaV1')
const layout = require('../views/reservaView');

router.use(layout)
router.use("/v1", reservaV1);


module.exports = router;
