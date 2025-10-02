
// file: assets/js/fps.mjs

class FPS {

  constructor() {
    this.value = 0
    this.count = 0
    this.lasttime = 0
    this.acctime = 0
  }

  update(timestamp) {
    ++this.count
    this.acctime += timestamp - this.lasttime
    this.lasttime = timestamp
    if (this.acctime >= 1000) {
      this.acctime -= 1000
      this.value = this.count
      this.count = 0
    }
  }

  render({ context, element }, x = 0, y = 0) {
    context.fillStyle = 'White'
    context.font = '18px monospace'
    context.textAlign = 'right'
    context.textBaseLine = 'top'
    context.fillText(this.value, element.width - x, y)
  }

}

export default FPS
