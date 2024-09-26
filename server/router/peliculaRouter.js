const router = require('express').Router();
// const cookieParser = require('cookie-parser')
const peliculaV1 = require('../version/peliculaV1')
const layout = require('../views/peliculaView');

router.use(layout)
router.use("/v1", peliculaV1);


module.exports = router;
