var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var axios = require('axios');
require('dotenv').config()
var { movies } = require('../public/javascripts/movies')

router.use(bodyParser.json());

router.post('/', function(req, res, next) {
  var movie = movies.filter((v,i) => v.id == req.body.id)[0];

  var data = getSendMessageInput(movie, req);
  
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
    res.redirect('/')
    res.sendStatus(200);
    return;
  })
  .catch(function (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  });

});

module.exports = router;


function getSendMessageInput(movie, req) {
  return JSON.stringify({
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
                "link": movie.thumbnail
              }
            }
          ]
        },
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": movie.title
            },
            {
              "type": "date_time",
              "date_time": {
                "fallback_value": movie.time
              }
            },
            {
              "type": "text",
              "text": movie.venue
            },
            {
              "type": "text",
              "text": req.body.seats
            }
          ]
        }
      ]
    }
  }
  );
}

