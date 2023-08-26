const Authenticator = require('./Authenticator.js')
const { google } = require('googleapis')

const auth = new Authenticator.local()
auth
  .authorizeApi({ scopes: ['https://www.googleapis.com/auth/drive'] })
  .then(function (client) {
    listFiles(client)
  })

/**
 * Lists the names and IDs of up to 10 files.
 * @param {import('googleapis').Auth.OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient })
  const res = await drive.files.list({
    pageSize: 10,
    fields:
      'nextPageToken, files(id, name, webContentLink, webViewLink, mimeType, parents)'
  })
  const files = res.data.files
  if (files.length === 0) {
    console.log('No files found.')
    return
  }

  console.log('Files:')
  files.map((file) => {
    console.log(`${file.name} (${file.id}, ${file.parents})`)
  })
}
