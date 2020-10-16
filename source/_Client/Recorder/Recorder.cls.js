module.exports = class Recorder extends PreCore.classes.Display {
  create(params) {
    console.log(params)
    super.create(params)
    this.format = "jpeg"
    const images = this.images = []


    const steps = this.steps = 7
    let step = 0
    this.generate(step)



    let intervalId = setInterval(() => {
      step++
      this.generate(step)
      if (step === steps) {
        return clearInterval(intervalId)
      }

    }, 200)


  }

  generate(step) {
    const {node, steps} = this,
        display = Dom.querySelector(node, ".Recorder-Display")

    const scale = 1 + 0.2*step/steps
    Dom.style(display, {transform: `scale(${scale}, ${scale})`}) //  rotateY(${step/steps*360}deg)`})
    this.snapshot(step === steps ? () => {
      PostCore.setImages(this.images)
    } : undefined)

  }

  snapshot(handler) {
    const {node, images} = this,
        container = Dom.querySelector(node, ".Recorder-Container"),
        canvasRecorder = Dom.querySelector(node, ".Recorder-Canvas"),
        recorderImages = Dom.querySelector(node, ".Recorder-Images")
    canvasRecorder.innerHTML = ""
    const canvas = Dom.create({
      parent: canvasRecorder,
      node: canvasRecorder,
      tag: "canvas",
      attributes: {width: 400, height: 400}
    })

    html2canvas(container, {canvas, scale: 1}).then(canvas => {
      console.log('Drew on the existing canvas', canvas);
      //    recorderCanvas.appendChild(canvas)
      const img = canvas.toDataURL("image/"+this.format)
      images.push(img)
  //    console.log(img)
      recorderImages.insertAdjacentHTML("beforeend", '<img src="' + img + '"/>')
      handler && handler()
      //     recorderCanvas.removeChild(canvas)

    })

  }
}

/*
    const ctx = canvas.getContext("2d")
      const data = ctx.getImageData(0, 0, 400, 400).data
    decoded = atob(img.substr(22))

 */
