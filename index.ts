
import * as dotenv from "dotenv";
import { Mail } from './classes/mail'
import Webhook from "./classes/webhook";
import cron = require('cron');
import consoleMsg from './config/index';
import * as express from 'express'
dotenv.config();
const app: express.Application = express();
app.use(express.static('attachment'))



const mail = Mail.getInstance();
const webhook = Webhook.getInstance();
webhook.setWebhookUrl(process.env.webhookUrl);
const getMail = async () => {

  const mailData = await mail.connect();
  if (mailData.length > 0)
    webhook.triggerWebhook(mailData);
  else
    console.log(consoleMsg.consoleMsg.message("No new 📧 !!!!!"))
  mail.close();
}

let CronJob = cron.CronJob;
var job = new CronJob('0 */1 * * * *', async () => {
  console.log(consoleMsg.consoleMsg.message('Process started 😁 😁 😁 😁 😁 😁 😁 '));
  await getMail();
  console.log(consoleMsg.consoleMsg.message('Process Complete 💃 💃 💃 💃 💃 💃 💃'));


}, null, true, 'America/Los_Angeles');
job.start();
app.listen(3000, function () {
  console.log('App is listening on port 3000!');
});







