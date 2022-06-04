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
  console.log('database:', process.env.DB_DATABASE);
  console.log('body.field:', JSON.stringify(req.body.field));
  console.log('body.entry:', JSON.stringify(req.body.entry));

  const entries = req.body.entry.map((entry)=>{
    const changes = entry.changes.map((change)=>{
      const messages = change.value.messages.map((message)=>{
        if (message.type == 'text') {
          console.log('message.text.body:', message.text.body);
          saveLog(message.id, message.text.body, function() {
            res.sendStatus(200);
          });
        }
      })
    })
  })

});

module.exports = router;


function saveLog(id, log, callback) {
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  con.connect(function (err) {
    if (err)
      throw err;
    console.log("Connected!");

    const sql = `REPLACE INTO logs (id, log) VALUES ('${id}', '${log}');`;
    con.query(sql, function (err, result) {
      if (err) {
        console.log("err: " + err);
        throw err;
      }
      console.log("Result: " + JSON.stringify(result));
      con.end();
      callback();
    });
  });
}

