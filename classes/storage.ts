import * as fs from 'fs';
import { errorMessage } from '../interfaces/storageInterface';


export default class Storage {
  private static instance: Storage | null;
  private fileLocation: string = process.env.workingDir + process.env.attachment;
  private status: errorMessage | undefined = undefined
  static getInstance() {
    if (!this.instance) {
      this.instance = new Storage();
    }
    return this.instance;
  }
  setFileLocation(location: string) {
    this.fileLocation = location;
  }

  getStatus() {
    return this.status;
  }
  saveAttachment(attachment: object | undefined = undefined, fileName: string | undefined = undefined) {
    if (attachment === undefined || fileName === undefined) {
      this.status = {
        status: false,
        message: "Attachment or file name missing"
      }
      return "";
    }
    const date: number = new Date().valueOf();
    const newFileName = `${date}${fileName}`;
    const location = `${this.fileLocation}${newFileName}`;
    try {
      fs.writeFile(location, attachment, error => {
        if (error) {
          console.log({ tile: 'file error', error })
          this.status = {
            status: false,
            message: "Error in writing file"
          }
        }
        else {
          this.status = {
            status: true,
            message: "Attachment copied successfully"
          }
        }
      });
      return newFileName;
    } catch (e) {
      throw e
    }
  }
}