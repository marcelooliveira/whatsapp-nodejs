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
      // "name": "sample_movie_ticket_confirmation",
      "name": "sample_issue_resolution",
      "language": {
        "code": "en_US"
      },
      "components": [{
                          "type" : "body",
                          "parameters": [{
                                          "type": "text",
                                          "text": "Top Gun 2"
                                        }
                                        // ,
                                        // {
                                        //   "type": "date_time",
                                        //   "date_time" : {
                                        //       "fallback_value": "May 1st, 2019 8:45pm",
                                        //       "day_of_month": 20,
                                        //       "year": 2019,
                                        //       "month": 9,
                                        //       "hour": 20,
                                        //       "minute": 45
                                        //   }
                                        // },
                                        // {
                                        //   "type": "text",
                                        //   "text": "Houston Grand Cinema"
                                        // },
                                        // {
                                        //   "type": "text",
                                        //   "text": "3"
                                        // }
                                      ]
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


