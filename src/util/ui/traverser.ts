import {readdirSync, stat} from 'fs'
import {resolve, sep} from 'path'

export interface FolderItem {
    name: string;
    isDirectory: boolean;
}

class Navigator {
  constructor(public rootPath: string) {}

  async goForwards(directory: string) {
    const newPath = resolve(this.rootPath, directory)
    return this.getContents(newPath)
  }

  async goBackwards() {
    const newPath = resolve(this.rootPath, '..')
    return this.getContents(newPath)
  }

  async getContents(path?: string) {
    const list = readdirSync(path || this.rootPath)
    const decoratedOutput: {name: string; isDirectory: boolean}[] = []

    for (const file of list) {
      const isDir = await this.isDir(resolve(path || this.rootPath, file))
      const dirPayload = {
        name: file,
        isDirectory: isDir,
      }
      decoratedOutput.push(dirPayload)
    }
    return decoratedOutput
  }

  async isDir(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      stat(path, function (err, stat) {
        if (err) reject(err)
        resolve(stat.isDirectory())
      })
    })
  }

  getSubfolders(list: FolderItem[]) {
    return list.filter(item => item.isDirectory)
  }
}

async function main() {
  const breaedcrumbs = process.cwd().split(sep)
  console.log('#breadcrums', breaedcrumbs)
  const inst = new Navigator(process.cwd())
  const res = await inst.goBackwards()
  console.log('1-level back', res)
  const subFolders = inst.getSubfolders(res)
  console.log('Sub-folders', subFolders)
  const mm = await inst.goBackwards()
  console.log('>', mm)
}
main()
