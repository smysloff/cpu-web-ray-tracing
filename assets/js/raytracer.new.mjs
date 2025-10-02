
// file: assets/js/raytracer.new.mjs

import { ColorRGBA } from './colors.mjs'
import { Vec3 } from './vectors.mjs'


const { PI, tan } = Math


class Raytracer {

  constructor() {
    this.scene = null
    this.color = null
  }

  run(scene, gc) {

    // 1) из учебника
    // каждую клетку холста
      // закрасить правильным цветом

    // 2) из учебника
    // правильно разместить точку обзора
    // для каждой клетки холста
    //  определить клетку сетки, соответствующую клетке на холсте
    //  определить цвет, наблюдаемый через клетку сетки
    //  закрасить клетку этим цветом

    // 3) мой
    // обновить ссылку на сцену (камера, объекты, освещение)

    this.scene = scene

    // для каждой клетки холста

    const { xMin, yMin, xMax, yMax } = gc
    const { width, height } = gc
    const { ratio } = gc

    const Viewplane = {}                  // Viewplane
    Viewplane.FOW = 60 * PI / 180         //
    Viewplane.mWidth = 1                  // соотношение Vw к Cw
    Viewplane.mHeight = 1                 // соотношение Vh к Ch
    Viewplane.width = width * V.mWidth    // Vw = Cw * Vmw
    Viewplane.height = height * V.mHeight // Vh = Ch * Vmh
    Viewplane.xMod = V.width / width      // Vw / Cw => x + Vw / Cw
    Viewplane.yMod = V.height / height    // Vh / Ch => y + Vh / Ch

    for (let y = yMin; y < yMax; ++y) {
      for (let x = xMin; x < xMax; ++x) {

        // перевести координаты пикселя C(x,y)
        // в координаты окна просмотра V(x,y,z) => Projecton

        const Vw = width  // Vw = Cw
        const Vh = height // Vh = Ch

        const Vx = x * (Vw / width)  // Cx * (Vw / Cw)
        const Vy = y * (Vh / height) // Cy * (Vh / Ch)

        // Vz = (h / 2) / Math.tan(angle / 2)
        const angle = 60 * Math.PI / 180
        const Vz = .5 / Math.tan(angle / 2)


        // получить итоговый цвет

        this.color = ColorRGBA.Black


        // закрасить клетку итоговым цветом

        gc.putPixel(x, y, this.color)
      }
    }


  }

}

export default Raytracer
