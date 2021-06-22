var express = require('express');
const { getServerStates } = require('../utils/server');
var router = express.Router();

router.get('/', async (req, res) => {
  const serverData = await getServerStates(true);
  const renderStart = new Date().getTime();

  res.render('players', { 
    serverData,
    renderStart
  });
});

module.exports = router;
