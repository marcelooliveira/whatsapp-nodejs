var express = require('express');
var router = express.Router();
var axios = require('axios');
require('dotenv').config()

var messageParams = {
  title: 'Top Gun 2',
  time: 'Wednesday, July 1, 2022 8:00 PM',
  venue: 'Houston Grand Cinema',
  seats: '3'
}

router.get('/', function(req, res, next) {
  // "to": process.env.RECIPIENT_WAID,
  var data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": process.env.RECIPIENT_WAID,
    "type": "template",
    "template": {
      "name": "sample_movie_ticket_confirmation",
      "language": {
      "code": "en_US"
      },
      "components": [
        {
          "type": "header",
          "parameters": [
            {
              "type": "image",
              "image": {
                "link": "https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_.jpg"
              }
            }
          ]
        },
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": "The Matrix"
            },
            {
              "type": "date_time",
              "date_time": {
                "fallback_value": "October 25, 2022 - 8:00 PM",
              }
            },
            {
              "type": "text",
              "text": "Grand Cinema"
            },
            {
              "type": "text",
              "text": 4
            }
          ]
        }
      ]
    }
  }
  );
  
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


