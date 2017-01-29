'use strict'
const token = process.env.FB_PAGE_ACCESS_TOKEN
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN
const express = require('express')
const apiai=require('apiai')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const apiaiapp = apiai("2ad98b4ef4a6487e82c5ebcd71f53065")
var messengerId
var requestApiai
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
   console.log(req.body);
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] ===vtoken) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {

  //console.log(req.body);
     let messaging_events =req.body.entry[0].messaging;
      //   console.log("messenger message;"+JSON.stringify(req.body.entry[0].messaging));


     for (let i = 0; i < messaging_events.length; i++) {
         let event = req.body.entry[0].messaging[i]
         let sender = event.sender.id
        if (event.message && event.message.text) {
             let text =event.message.text;
              messengerId=sender;
           // console.log("text to apiai;;"+text);

             requestApiai = apiaiapp.textRequest(text, {
                 sessionId: 'abcdefg'
             });

             console.log(requestApiai);
             requestApiai.on('response', function(response) {
                  sendTextMessage(messengerId,response.result.fulfillment.speech);
                  console.log(response);
              });


             requestApiai.on('error', function(error) {
                 console.log(error);
             });

                   requestApiai.end();

           }//end of if block
         }//end of for loop

})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
