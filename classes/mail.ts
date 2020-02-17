import * as imaps from 'imap-simple';
import { ImapConfigurationInterface } from '../interfaces/imapConfigInterface';
import { resolve } from 'dns';
import { rejects } from 'assert';


export class Mail {
  private connection: any;
  public searchCriteria: any[];
  public fetchOptions: object;
  private rawMessages: any;
  public folder: any;
  public config: any;
  constructor(config: ImapConfigurationInterface, folder: string = "INBOX") {
    this.folder = folder;
    this.setFetchOptions();
    this.setSearchCriteria();
    this.config = config;
  }

  async connect() {
    try {
      this.connection = await imaps.connect(this.config)
      await this.openInBox(this.folder);
      const attachments: any = await this.processMessage();
      return attachments;
    } catch (e) {
      throw (e)
    }
  }
  setSearchCriteria(options: any[] = ['UNSEEN']) {
    this.searchCriteria = options;
  }
  setFetchOptions(options: object = { bodies: ['HEADER.FIELDS (TO FROM SUBJECT)', 'TEXT'], struct: true, markSeen: false }) {
    this.fetchOptions = options;
  }
  async openInBox(folder: string = 'INBOX') {
    await this.connection.openBox(folder)
    this.rawMessages = await this.connection.search(this.searchCriteria, this.fetchOptions);
  }

  processMessage() {
    const self = this;

    const messages = []
    this.rawMessages.map(function (message, i) {
      let content = new Promise(async (resolve, reject) => {
        let emailMessage = {
          header: '',
          bodyText: '',
          bodyHTML: '',
          attachment: []
        }
        const header = message.parts.filter(function (part) {
          return part.which === 'HEADER.FIELDS (TO FROM SUBJECT)';
        });
        emailMessage.header = header[0].body

        const data = await self.getParts(message, emailMessage);
        resolve(data);
      });
      messages.push(content);
    })

    return Promise.all(messages);

  }

  async getParts(message, emailMessage) {

    const self = this;
    const parts = await imaps.getParts(message.attributes.struct);
    const data = [];
    parts.map(async (part, i) => {
      data.push(new Promise(async (res, reject) => {
        const partData = await self.connection.getPartData(message, part);
        if (i == 0) {
          emailMessage.bodyText = partData
        } else if (i == 1) {
          emailMessage.bodyHTML = partData
        } else {
          emailMessage.attachment.push(partData);
        }
        res(emailMessage)
      }));
    });
    return Promise.all(data);
  }


  getMessage() {
    return this.rawMessages;
  }
}