const { google } = require('googleapis')
const readline = require('readline')
const fs = require('fs')
const fsProm = fs.promises
const path = require('upath')
const open = require('open')
const globals = require('./_globals')
const { glob } = require('glob')

const CACHE_PATH = globals.getCacheDir()
const TOKEN_PATH = path.join(CACHE_PATH, '.token.json')

const CREDENTIAL_PATH = [
  path.join(process.cwd(), 'google-api-key.json'),
  path.join(process.cwd(), 'google-api-keys.json')
]
  .concat(...glob.sync('client_secret_*.json', { cwd: process.cwd() }))
  .filter((loc) => fs.existsSync(loc))[0]
let credential = { redirect_uris: [''] }

if (!CREDENTIAL_PATH) {
  throw new Error(
    'Google Api Key JSON not found. add google-api-key.json to your root project'
  )
} else if (fs.existsSync(CREDENTIAL_PATH)) {
  const keyFile = require(CREDENTIAL_PATH)
  credential = keyFile.installed || keyFile.web
}

console.log({ credential })

class AuthenticatorLocal {
  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   * @link https://developers.google.com/people/quickstart/nodejs
   * @param {import('googleapis').Auth.OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client) {
    const content = await fsProm.readFile(CREDENTIAL_PATH)
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token
    })

    client.on('tokens', async function (newTokens) {
      //ensure that always the latest tokens are stored in the cache

      //if no token is stored yet: return
      if (!fs.existsSync(TOKEN_PATH)) {
        return
      }

      let tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
      tokens.access_token = newTokens.access_token
      tokens.type = 'authorized_user'

      if (newTokens.refresh_token) {
        tokens.refresh_token = newTokens.refresh_token
      }

      //save new tokens
      await fsProm.writeFile(TOKEN_PATH, JSON.stringify(tokens))
      console.log('Updated cached oAuth Tokens')
    })

    await fsProm.writeFile(TOKEN_PATH, payload)
  }

  /**
   * Reads previously authorized credentials from the save file.
   * @link https://developers.google.com/people/quickstart/nodejs
   * @return {Promise<import('googleapis').Auth.OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist() {
    try {
      const content = await fsProm.readFile(TOKEN_PATH)
      const credentials = JSON.parse(content)
      return google.auth.fromJSON(credentials)
    } catch (err) {
      return null
    }
  }

  /**
   * Load or request or authorization to call APIs.
   * @returns {Promise<import('googleapis').Auth.OAuth2Client>}
   */
  async authorizeApi(options = { scopes: [] }) {
    const { authenticate } = require('@google-cloud/local-auth')

    let client = await this.loadSavedCredentialsIfExist()
    if (client) {
      return client
    }
    client = await authenticate({
      scopes: options.scopes || [],
      keyfilePath: CREDENTIAL_PATH
    })
    if (client.credentials) {
      await this.saveCredentials(client)
    }
    return client
  }
}

class Authenticator {
  /**
   * Auth using `@google-cloud/local-auth`
   * * download api json file then rename and put `google-api-key.json` to root project
   * @returns
   */
  static local = AuthenticatorLocal

  /**
   * Check expiry dates of token
   * @param {import('googleapis').Auth.OAuth2Client} oauth2Client
   * @returns {import('googleapis').Auth.OAuth2Client|undefined}
   */
  async validateToken(oauth2Client) {
    if (fs.existsSync(TOKEN_PATH)) {
      /**
       * @type {import('googleapis').Auth.Credentials}
       */
      const tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token)

      //console.log(tokenInfo.expiry_date)
      //console.log(Date.now())
      //console.log('DIFFERENT IN TIMES', tokenInfo.expiry_date , Date.now())
      if (tokenInfo.expiry_date > Date.now()) return oauth2Client
    }
  }

  /**
   *
   * @returns {Promise<import('googleapis').Auth.OAuth2Client>}
   * @example
   * Authenticator.authenticate().then((oAuth) => {
    const drive = google.drive({
      version: 'v3',
      auth: oAuth
    })
  })
   */
  static authenticate() {
    return new Promise((resolveAuth) => {
      const oauth2Client = new google.auth.OAuth2(
        '17772065749-bqi8lg8v5kovrp75ai0efa6m2rbimp9s.apps.googleusercontent.com',
        'lVdcPKrKwpJncleFI77URygS',
        'https://drivesync-223223.appspot.com/'
      )

      //ensure that always the latest tokens are stored in the cache
      oauth2Client.on('tokens', async (newTokens) => {
        //if no token is stored yet: return
        if (!fs.existsSync(TOKEN_PATH)) {
          return
        }

        let tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
        tokens.access_token = newTokens.access_token

        if (newTokens.refresh_token) {
          tokens.refresh_token = newTokens.refresh_token
        }

        //save new tokens
        await fsProm.writeFile(TOKEN_PATH, JSON.stringify(tokens))
        console.log('Updated cached oAuth Tokens')
      })

      const tokens = async (resolve) => {
        //if token is already stored, use this one, otherwise ask for authorization to get a token
        if (fs.existsSync(TOKEN_PATH)) {
          let tokens = JSON.parse(await fsProm.readFile(TOKEN_PATH))
          resolve(tokens)
        } else {
          const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/drive', //all Drive Permissions
            prompt: 'consent'
          })

          console.log('Please open the following url in the browser: ' + url)
          open(url)

          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })

          rl.question('Please enter the code: ', async (code) => {
            rl.close()

            let tokens = (await oauth2Client.getToken(code)).tokens
            //store the token in cache
            await fsProm.writeFile(TOKEN_PATH, JSON.stringify(tokens))

            resolve(tokens)
          })
        }
      }

      tokens(function (token) {
        oauth2Client.setCredentials(token)
        resolveAuth(oauth2Client)
      })
    })
  }

  static scopes = [
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/contacts.readonly'
  ]
}

module.exports = Authenticator
