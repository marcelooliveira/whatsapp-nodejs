var express = require('express');
var router = express.Router();
var axios = require('axios');
require('dotenv').config()

router.get('/', function(req, res, next) {
  var data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": process.env.RECIPIENT_WAID,
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  });
  
  var config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: { 
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

});

module.exports = router;


