import * as imaps from 'imap-simple';
import Storage from './storage'
import { ImapConfigurationInterface, emailMessageFormatInterface } from '../interfaces/imapConfigInterface';
import config from '../config/index';

export class Mail {

  private static instance: Mail | null;
  private connection: any;
  public searchCriteria: any[];
  public fetchOptions: object;
  private rawMessages: any;
  public folder: any;
  public config: any = {
    imap: {
      user: process.env.email,
      password: process.env.password,
      host: process.env.host,
      port: parseInt(process.env.port),
      tls: process.env.tls === 'true' ? true : false,
    }
  };
  private storage: Storage;
  constructor() {
    this.storage = Storage.getInstance();
    this.setFetchOptions();
    this.setSearchCriteria();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Mail();
    }
    return this.instance;
  }

  setConfig(config: ImapConfigurationInterface, folder: string = "INBOX") {
    this.folder = folder;
    this.config = config;

  }


  async connect() {
    try {
      console.log(config.consoleMsg.message("Connecting imap server.....🏃 🏃 🏃 🏃 🏃 🏃 "));

      this.connection = await imaps.connect(this.config);
      console.log(config.consoleMsg.message("Opening InBox....📬 📬 📬 📬 📬 📬"));
      await this.openInBox(this.folder);
      console.log(config.consoleMsg.message("Parsing Email....📥 📥 📥 📥 📥"));
      const attachments: any = await this.processMessage();
      return attachments;
    } catch (e) {
      throw (e)
    }
  }

  close() {
    console.log(config.consoleMsg.message("Closing imap server.....📪 📪 📪 📪 📪 📪 📪"));

    this.connection.end();
  }
  setSearchCriteria(options: any[] = ['UNSEEN']) {
    this.searchCriteria = options;
  }
  setFetchOptions(options: object = { bodies: ['HEADER.FIELDS (TO FROM SUBJECT)', 'TEXT'], struct: true, markSeen: true }) {
    this.fetchOptions = options;
  }
  async openInBox(folder: string = 'INBOX') {
    await this.connection.openBox(folder)
    this.rawMessages = await this.connection.search(this.searchCriteria, this.fetchOptions);
  }

  async processMessage() {
    const self = this;

    let messages = [];
    for (let i = 0; i < this.rawMessages.length; i++) {
      const message = this.rawMessages[i];
      let emailMessage: emailMessageFormatInterface = {
        header: {},
        bodyText: '',
        bodyHTML: '',
        attachment: []
      }
      const header = message.parts.filter(function (part: any) {
        return part.which === 'HEADER.FIELDS (TO FROM SUBJECT)';
      });
      emailMessage.header = header[0].body
      const data: any = await self.getParts(message, emailMessage);
      messages.push(data);
    }
    return messages;

  }

  async getParts(message: any, emailMessage: emailMessageFormatInterface) {

    const self = this;
    const parts = await imaps.getParts(message.attributes.struct);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const partData = await self.connection.getPartData(message, part);
      if (i == 0) {
        emailMessage.bodyText = partData
      } else if (i == 1) {
        emailMessage.bodyHTML = partData
      } else {
        const location: string = await this.storage.saveAttachment(partData, part.params.name);
        emailMessage.attachment.push(process.env.fileServerUrl + '' + location);
      }
    }

    return emailMessage;
  }


  getMessage() {
    return this.rawMessages;
  }
}