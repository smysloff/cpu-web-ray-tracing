
// file: assets/js/color.mjs

class ColorRGBA {

  constructor(r, g, b, a = 255) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  static get Black()   { return new ColorRGBA(  0,   0,   0) }
  static get White()   { return new ColorRGBA(255, 255, 255) }
  static get Red()     { return new ColorRGBA(255,   0,   0) }
  static get Green()   { return new ColorRGBA(  0, 255,   0) }
  static get Blue()    { return new ColorRGBA(  0,   0, 255) }
  static get Yellow()  { return new ColorRGBA(255, 255,   0) }
  static get Cyan()    { return new ColorRGBA(  0, 255, 255) }
  static get Magenta() { return new ColorRGBA(255,   0, 255) }

  multiply(factor) {
    const { min, max } = Math
    const r = min(255, max(0, this.r * factor))
    const g = min(255, max(0, this.g * factor))
    const b = min(255, max(0, this.b * factor))
    return new ColorRGBA(r, g, b, this.a)
  }

}

export { ColorRGBA }
