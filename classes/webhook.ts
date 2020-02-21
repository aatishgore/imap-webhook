
var querystring = require('querystring');
var request = require('request');
import axios from 'axios';
export default class Webhook {
  private static instance: Webhook | null;
  public webhookUrl: string | undefined = undefined
  static getInstance() {
    if (!this.instance) {
      this.instance = new Webhook();
    }
    return this.instance;
  }
  setWebhookUrl(url: string) {
    this.webhookUrl = url;
  }

  triggerWebhook(data: any) {

    axios.post(this.webhookUrl, data)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.error(error)
      })
  }

}