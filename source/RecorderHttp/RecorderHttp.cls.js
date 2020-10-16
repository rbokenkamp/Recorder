const fs = require("fs"),
    videoshow = require('videoshow')

module.exports = class RecorderHttp extends PreCore.classes.Http {

  create(params) {
    console.log("^".repeat(40))
    // @@@TODO move this to instance


    super.create(params)
    Object.assign(this.mimes, {
      gif: "image/gif",
      mp4: "video/mp4",
      map: "application/octet-stream",
    })
  }

  images(params) {
    console.log(params)
  }

  generateVideo() {
    const {parent} = this,
        {home} = parent
    const path = __dirname + "/images"
    const images = fs.readdirSync(path).map(item => path + "/" + item),
        {length} = images

    console.log("@", images)
    var videoOptions = {
//  fps: length,
      loop: 4 / length, // seconds
      transition: false,
      transitionDuration: 0, // seconds
//  transition: false,
//  videoBitrate: 1024,
      // videoCodec: 'libx264',
      size: '200x?',
      //     audioBitrate: '128k',
      //     audioChannels: 2,
//  format: 'mp4',
      pixelFormat: 'yuv420p'
    }
    console.log({home})

    videoshow(images, videoOptions)
    //  .audio('./loons.mp3')
        .save(this.parent.home + "/_www/img/video.gif")
        .on('start', function (command) {
          console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
          console.error('Error:', err)
          console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
          console.error('Video created in:', output)
        })

  }

  remove(path) {
    const items = fs.readdirSync(path)
    for (const item of items) {
      fs.unlinkSync(path + "/" + item)
    }
    fs.rmdirSync(path)
  }

  images(images) {
    console.log("PROCESS")
    const path = __dirname + "/images"
    if (fs.existsSync(path)) {
      this.remove(path)
    }
    fs.mkdirSync(path)
    const length = images.length
    console.log(images.length)
    let i = 0
    for (const image of images) {
      let format
      image.replace(/^data\:image\/([^\;]+)/, (_, _format) => format = _format)
      console.log(format)
      const data = Buffer.from(image.substr(19 + format.length), "base64")
      fs.writeFileSync(path + "/image" + i + "." + (format === "jpeg" ? "jpg" : "png"), data)
      i++
    }
    this.generateVideo()
  }
}
