require("Core")
const  ConfiguratorServer = require("./source/RecorderServer/RecorderServer.cls"),
    params = require("./core.params.js")


process.on('uncaughtException', err => {
  console.log('UNCAUGHT:', err)
})
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
})


process.title = "recorder"

global.core = new ConfiguratorServer()

try {
  const t0 = Date.now()
  core.instance(params, core)
  console.log("elapsed", Date.now() - t0)
  const release = () => core.signal("release")
  process.on("SIGINT", release)
  process.on("SIGHUB", release)
  process.on("SIGQUIT", release)

} catch (err) {
  const {CoreError} = PreCore.classes
  if (err instanceof CoreError === false) {
    err = new CoreError(err)
  }
  const {message, code, params, path, line, column, trace} = err
  console.log("@@@ error @@@", {message, code, params, path, line, column, trace})

}

