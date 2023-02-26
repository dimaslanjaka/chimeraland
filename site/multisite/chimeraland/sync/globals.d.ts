export interface ResponseListRemote {
  files: {
    id: string
    name: string
    mimeType: string
    modifiedTime: string
    parents: Array<any>
  }[]
}
