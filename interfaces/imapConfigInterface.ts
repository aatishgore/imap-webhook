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
