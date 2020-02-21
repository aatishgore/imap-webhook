
import * as dotenv from "dotenv";
import { ImapConfigurationInterface } from './interfaces/imapConfigInterface';
import { Mail } from './classes/mail'
import Webhook from "./classes/webhook";
dotenv.config();

var config: ImapConfigurationInterface = {
  imap: {
    user: process.env.email,
    password: process.env.password,
    host: process.env.host,
    port: parseInt(process.env.port),
    tls: process.env.tls === 'true' ? true : false,
  }
};

const mail = Mail.getInstance();
const webhook = Webhook.getInstance();
webhook.setWebhookUrl(process.env.webhookUrl);
mail.setConfig(config);
const getMail = async () => {

  const mailData = await mail.connect();
  webhook.triggerWebhook(mailData);
}
getMail();





// imaps.connect(config).then(function (connection: any) {

//   connection.openBox('INBOX').then(function () {

//     // Fetch emails from the last 24h
//     const delay: number = 24 * 3600 * 1000;
//     var yesterday: Date = new Date();
//     yesterday.setTime(Date.now() - delay);

//     const since: string = yesterday.toISOString();
//     var searchCriteria: any[] = ['UNSEEN', ['SINCE', yesterday]];
//     var fetchOptions: object = { bodies: ['HEADER', 'TEXT'], struct: true, markSeen: false };

//     // retrieve only the headers of the messages
//     return connection.search(searchCriteria, fetchOptions);
//   }).then(function (messages) {
//     console.log(messages[0].parts[1]);
//     var attachments = [];

//     messages.forEach(function (message) {
//       var parts = imaps.getParts(message.attributes.struct);
//       attachments = attachments.concat(parts.filter(function (part) {
//         return part.disposition && part.disposition.type.toUpperCase() === 'TEXT';
//       }).map(function (part) {
//         // retrieve the attachments only of the messages with attachments
//         return connection.getPartData(message, part)
//           .then(function (partData) {
//             return {
//               filename: part.disposition.params.filename,
//               data: partData
//             };
//           });
//       }));
//     });

//     return Promise.all(attachments);
//   }).then(function (attachments) {
//     console.log(attachments);
//     // =>
//     //    [ { filename: 'cats.jpg', data: Buffer() },
//     //      { filename: 'pay-stub.pdf', data: Buffer() } ]
//   });
// });
