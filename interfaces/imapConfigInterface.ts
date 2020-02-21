export interface ImapConfigurationInterface {
  imap: EmailConfigurationInterface
}
interface EmailConfigurationInterface {
  user: string,
  password: string,
  host: string,
  port: number,
  tls: boolean,
  authTimeout?: number
}

export interface emailMessageFormatInterface {
  header: object,
  bodyText: string,
  bodyHTML: string,
  attachment: any[]
}
