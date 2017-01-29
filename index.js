'use strict'
//console.log("Hi");
const token = process.env.FB_PAGE_ACCESS_TOKEN
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN
const express = require('express')
const apiai=require('apiai')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const apiaiapp = apiai("2ad98b4ef4a6487e82c5ebcd71f53065");

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
   console.log('REQUEST'+req);
   console.log('REQUEST'+res);

  //  res.send( req.body.entry[0].messaging);
  //console.log(req.body.result.fulfillment.speech);
//    let messaging_events =
//     for (let i = 0; i < messaging_events.length; i++) {
//        let event = req.body.entry[0].messaging[i]
//        let sender = event.sender.id
//        if (event.message && event.message.text) {
            let text ="hello"// req.body.result.fulfillment.speech;//event.message.text
          //  let sessionIdOfUser=req.body.sessionId;

      /***************************************/
            var request = apiaiapp.textRequest(text, {
                sessionId: sessionIdOfUser//'abcdefg'
            });

            request.on('response', function(response) {
                    //var temp=JSON.parse(response);
                      response.send("from apiai");
              //var ans=response.result.fulfillment.speech;
                    //action
              //sendTextMessage(sender, text)
            });
            // sendTextMessage(sender, text)
            request.on('error', function(error) {
                console.log(error);
            });

            request.end();
    /************************************************/
//        }
//    }
    res.sendStatus(200)
})/*
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
          headers:{
            'Content-Type':'application/json',
            'Content-Length':Buffer.byteLength(messageData)
          },
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
*/
