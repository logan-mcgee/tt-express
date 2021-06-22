var express = require('express');
const { getServerStates } = require('../utils/server');
var router = express.Router();

router.get('/', async (req, res) => {
  const serverData = await getServerStates();
  const renderStart = new Date().getTime();

  res.render('index', { 
    serverData,
    renderStart
  });
});

module.exports = router;
