
// file: assets/js/gc.mjs

import { ColorRGBA } from './colors.mjs'

const { floor } = Math

class GC {

  constructor(width, height) {
    this.element = document.createElement('canvas')
    this.context = this.element.getContext('2d')
    if (width) this.element.width = width
    if (height) this.element.height = height
  }

  updateBoundaries() {

    const {
      xMin, yMin,
      xMax, yMax,
      width, height,
      hWidth, hHeight,
      ratio,
    } = this.getElementBoundaries(this.buffer)

    this.xMin = xMin
    this.yMin = yMin
    this.xMax = xMax
    this.yMax = yMax
    this.width = width
    this.height = height
    this.hWidth = hWidth
    this.hHeight = hHeight
    this.ratio = ratio
  }

  getElementBoundaries(element) {

    const { width, height } = element
    const hWidth = floor(width * .5)
    const hHeight = floor(height * .5)
    const xMin = -hWidth
    const yMin = -hHeight
    const xMax = xMin + width
    const yMax = yMin + height
    const ratio = height / width

    return {
      xMin, yMin,
      xMax, yMax,
      width, height,
      hWidth, hHeight,
      ratio,
    }
  }

  mountTo(root) {

    const { width, height } = this.element

    this.root = root
    this.root.append(this.element)

    this.buffer =
      this.context.getImageData(0, 0, width, height)

    this.updateBoundaries()
  }

  putPixel(x, y, color) {

    const { data } = this.buffer
    const { r, g, b, a } = color

    if (
         x < this.xMin || x >= this.xMax
      || y < this.yMin || y >= this.yMax
    ) return

    const cx = x + this.hWidth
    const cy = y + this.hHeight
    const index = (cy * this.width + cx) * 4

    data[index    ] = r
    data[index + 1] = g
    data[index + 2] = b
    data[index + 3] = a
  }

  clean() {

    const { data } = this.buffer
    const { r, g, b, a } = ColorRGBA.Black

    for (let i = 0; i < data.length; i += 4) {
      data[i    ] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    }

  }

  render(scene, renderer) {
    renderer.run(scene, this)
  }

  blit() {
    this.context.putImageData(this.buffer, 0, 0)
  }

}

export default GC
