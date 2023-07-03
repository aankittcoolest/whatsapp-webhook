import express, { Router } from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";

const api = express();

const router = Router();
api.use(bodyParser.json());
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

api.use("/api/", router);
export const handler = serverless(api);
