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

  // const body = JSON.parse(req.body)
  // const entries = req.body.entry.map((entry)=>{
  //   const changes = entry.changes.map((change)=>{
  //     const messages = change.value.messages.map((message)=>{
  //       console.log('message.text.body:', message.text.body);
  //     })
  //   })
  // })

  // const body = req.body
  // if (body.field !== 'messages') {
  //   // not from the messages webhook so dont process
  //   return res.sendStatus(400)
  // }

  // const reviews = body.value.messages.map((message) => {
  //   const reviewInfo = {
  //     TableName: process.env.REVIEW_TABLE,
  //     Item: {
  //       phonenumber: message.from,
  //       review: message.text.body
  //     }
  //   }
  //   return dynamoDb.put(reviewInfo).promise()
  // })
  // // return 200 code once all reviews have been written to dynamoDB
  // return Promise.all(reviews).then((data) => res.sendStatus(200));


  let saveLogCount = 1;

  const entries = req.body.entry.map((entry)=>{
    const changes = entry.changes.map((change)=>{
      const messages = change.value.messages.map((message)=>{
        if (message.type == 'text') {
          console.log('message.text.body:', message.text.body);
          console.log('saveLogCount:', saveLogCount++);
          saveLog(message.id, message.text.body);
          res.sendStatus(200);
          return;
        }
      })
    })
  })

  console.log('55');

  console.log('req.isXHubValid()', req.isXHubValid());

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  console.log('65');

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  received_updates.unshift(req.body);

  res.sendStatus(200);
});

module.exports = router;


function saveLog(id, log) {
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
    });
  });
}

