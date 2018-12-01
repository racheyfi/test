const router = require('express').Router();
const { getTree } = require('../controllers/graph');

router.get('/packages/:name/:version', async function (req, res) {
    let result = await  getTree(req.params.name, req.params.version);
    res.status(200).send(result);
});

module.exports = router;
