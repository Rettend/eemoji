/* eslint-disable vars-on-top */
/* eslint-disable no-var */

interface EemojiPkg {
  entryDir: string
}

declare global {
  var __eemoji_pkg__: EemojiPkg
}

export {}
