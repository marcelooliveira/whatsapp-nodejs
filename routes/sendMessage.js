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
  var data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": process.env.RECIPIENT_WAID,
    "type": "template",
    "template": {
      "name": "sample_movie_ticket_confirmation",
      "language": {
        "code": "en_US"
      },
      "components": [{
        "type": "body",
        "parameters": [{
                        "type" : "header",
                        "parameters": [
                            {
                                "type": "text",
                                "text": "THIS IS A SILLY TITLE"
                            }
                        ]
                      },
                      {
                          "type" : "body",
                          "parameters": [
                        {
                          "type": "text",
                          "text": "Top Gun 2"
                        },
                        {
                          "type": "date_time",
                          "date_time" : {
                              "fallback_value": "February 25, 1977",
                              "day_of_week": 5,
                              "day_of_month": 25,
                              "year": 1977,
                              "month": 2,
                              "hour": 15,
                              "minute": 33
                          }
                      },
                        {
                          "type": "text",
                          "text": "Houston Grand Cinema"
                        },
                        {
                          "type": "text",
                          "text": "3"
                        }]
                      }]
           }]      
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


