if (!process.env.DEBUG) process.env.DEBUG = 'prerender-it*'
import { TaskFunctionCallback } from 'gulp'
import { join } from 'path'
import { ServerSnapshot } from 'react-prerender-it'
import {
  AttendantsData,
  MaterialsData,
  MonstersData,
  RecipesData
} from './src/utils/chimeraland'

export const SSGRoutes = MonstersData.concat(<any>RecipesData)
  .concat(<any>MaterialsData)
  .concat(<any>AttendantsData)
  .map((item) => item.pathname)

export const gulpSnap = (done: TaskFunctionCallback) => {
  ServerSnapshot({
    source: join(__dirname, 'build'),
    routes: SSGRoutes,
    registerStatic: [join(__dirname, 'blog')],
    dest: join(__dirname, '.deploy_git'),
    autoRoutes: true,
    callback: (result) => {
      try {
        result.server.close()
        console.log('snap finish')
      } catch {
        console.log('snap finish, but caught error')
      }
      done()
    }
  })
}
