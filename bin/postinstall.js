const process = require('node:process')
const exec = require('node:child_process').exec
const platform = require('node:os').platform()

if (platform === 'linux') {
  if (!process.env.SKIP_POSTINSTALL) {
    exec('node ./bin/eemoji.mjs init -c none', (err, stdout) => {
      if (err)
        console.error(err)

      else
        console.log(stdout)
    })
  }
}
else {
  exec('node ./bin/eemoji.mjs init -c none', (err, stdout) => {
    if (err)
      console.error(err)

    else
      console.log(stdout)
  })
}
