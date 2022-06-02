var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var express = require('express');
var xhub = require('express-x-hub');
var mysql = require('mysql');

router.use(xhub({ algorithm: 'sha1', secret: process.env.FACEBOOK_APP_SECRET }));
router.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_updates = [];

router.get(['/'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

router.post('/', function(req, res, next) {
  console.log('Facebook request body:', req.body);
  console.log('host:', process.env.DB_HOST);
  console.log('user:', process.env.DB_USER);
  console.log('password:', process.env.DB_PASSWORD);
  console.log('body.entry:', req.body.entry);

  // const body = JSON.parse(req.body)
  const body = req.body
  const entries = body.entry.map((entry)=>{
    const changes = entry.changes.map((change)=>{
      console.log('change:', change);
    })
  })

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);

  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    const sql = `INSERT INTO logs (log) VALUES ('${req.body}');`
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
    });    
  });

  res.sendStatus(200);
});

module.exports = router;


