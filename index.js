const express = require("express")
const serverless = require("serverless-http")
const bodyParser = require("body-parser")

const api = express()

const router = require("express").Router();
api.use(bodyParser.json())

router.get('/whatsapp-webhook', (req, res) => {
    console.log('Received webhook:', req.body)
    res.sendStatus(200)
})

router.get('/', (req, res) => {
    console.log('', req.body)
    res.status(200).json({
        message: "This is a test point to test whether application is up and running!"
    })
})

api.use('/api/', router)

const handler= serverless(api)
module.exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};