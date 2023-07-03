import express, { Router } from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import axios from "axios";

const api = express();

const router = Router();
api.use(bodyParser.json());

router.get("/whatsapp-webhook", (req, res) => {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == "a547dddfa1fb76b69935f35b9bad5f3e"
  ) {
    return res.send(req.query["hub.challenge"]);
  }
  return res.sendStatus(400);
});

router.post("/whatsapp-webhook", async (req, res) => {
  console.log("Received webhook:");
  console.log(JSON.stringify(req.body, null, 4));
  console.log(req.body);
  const entries = req.body.entry
  console.log(entries);
  const changes = entries[entries.length - 1].changes;
  console.log(changes);
  const messages = changes[changes.length - 1].messages;
  console.log(messages);
  const current_message = messages[messages.length - 1];
  console.log(current_message);

  if (
    current_message.from === `${process.env.WHATS_APP_ENTITY1_NUMBER}` &&
    current_message.type === "text"
  ) {
    console.log("This qualifies me to forward the message");
    const message_format = {
      messaging_product: "whatsapp",
      to: `${process.env.WHATS_APP_ENTITY1_NUMBER}`,
      type: "text",
      text: current_message.text,
    };

    //forward the message
    const { data } = await axios.post(
      `${process.env.WHATS_APP_MESSAGE_ENDPOINT}`,
      message_format,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WHATS_APP_TOKEN}`,
        },
      }
    );
    console.log(JSON.stringify(data, null, 4));
  }
  // console.log(JSON.stringify(req.body, null, 4));
  console.log(req.body);
  res.status(200).json({
    message: JSON.stringify(req.body),
  });
});

router.get("/", (req, res) => {
  console.log("", req.body);
  res.status(200).json({
    message:
      "This is a test point to test whether application is up and running!",
  });
});

api.use("/api/", router);
export const handler = serverless(api);
