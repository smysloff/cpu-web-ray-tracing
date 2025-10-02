
// file: assets/js/index.mjs

import { Vec3 } from './vectors.mjs'
import { ColorRGBA } from './colors.mjs'
import FPS from './fps.mjs'
import GC from './gc.mjs'
import Scene from './scene.mjs'
import Raytracer from './raytracer.new.mjs'


const WINDOW_WIDTH = 320
const ASPECT_RATIO = .5625
const CAMERA_SPEED = .025


const gc = new GC(WINDOW_WIDTH, WINDOW_WIDTH * ASPECT_RATIO)
const fps = new FPS()
const scene = new Scene()
const raytracer = new Raytracer()


let cameraSpeed = CAMERA_SPEED
gc.element.style.border = '4px solid Black'


scene.addCamera(0, 0, 0)

scene.addSphere({
  position: new Vec3(0, -1, 3.25),
  radius: 1,
  color: ColorRGBA.Red,
  specular: 500,
  reflective: .2,
})

scene.addSphere({
  position: new Vec3(2, 0, 4),
  radius: 1,
  color: ColorRGBA.Green,
  specular: 500,
  reflective: .3,
})

scene.addSphere({
  position: new Vec3(-1, 0, 5),
  radius: 1,
  color: ColorRGBA.Yellow,
  specular: 10,
  reflective: .4,
})

scene.addSphere({
  position: new Vec3(0, -5001, 0),
  radius: 5000,
  color: ColorRGBA.Blue,
  specular: 1000,
  reflective: .5,
})

scene.addLight({
  type: 'ambient',
  intensity: .2,
})

scene.addLight({
  type: 'point',
  intensity: .6,
  position: new Vec3(2, 1, 0),
})

scene.addLight({
  type: 'directional',
  intensity: .2,
  direction: new Vec3(1, 4, 4),
})


function cameraMove() {
  scene.camera.x += cameraSpeed
  if (scene.camera.x > 2.5 || scene.camera.x < -2.5) {
    cameraSpeed = -cameraSpeed
  }
}

function frame(timestamp = 0) {
  window.requestAnimationFrame(frame)
  fps.update(timestamp)
  cameraMove()
  gc.clean()                  // красим буфер в черный
  gc.render(scene, raytracer) // рисуем кадр на буфере
  gc.blit()                   // переносим с буфера на холст
  fps.render(gc, 13, 23)
}

document.addEventListener('DOMContentLoaded', () => {
  gc.mountTo(document.body)   // создаем буфер и холст
  frame()
})
