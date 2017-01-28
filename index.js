'use strict'

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
    let messaging_events = req.body.entry[0].messaging
     for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text


      /***************************************/
            var request = apiaiapp.textRequest(text, {
                sessionId: 'abcdefg'
            });

            request.on('response', function(response) {
                console.log(response);
              var ans=response;
                    //action
              sendTextMessage(sender, ans)
            });

            request.on('error', function(error) {
                console.log(error);
            });

            //request.end();
    /************************************************/
        }
    }
    res.sendStatus(200)
})
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
