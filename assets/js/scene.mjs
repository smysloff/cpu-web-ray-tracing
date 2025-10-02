
// file: assets/js/scene.mjs

import { Vec3 } from './vectors.mjs'

class Scene {

  constructor() {
    this.camera = null
    this.spheres = []
    this.lights = []
  }

  addCamera(x, y, z) {
    this.camera = new Vec3(x, y, z)
  }

  addSphere(options) {
    const computed = {
      r_pow_2: options.radius * options.radius,
    }
    this.spheres.push({ ...options, ...computed })
  }

  addLight(options) {
    this.lights.push(options)
  }

}

export default Scene
