var express = require('express');
const { getServerStates } = require('../utils/server');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  const serverData = await getServerStates();
  const renderStart = new Date().getTime();

  res.render('index', { 
    title: 'Tycoon Lagoon - Homes',
    serverData,
    renderStart
  });
});

module.exports = router;
