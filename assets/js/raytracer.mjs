
// file: assets/js/raytracer.mjs

import { Vec3 } from './vectors.mjs'
import { ColorRGBA } from './colors.mjs'


const { sqrt, pow } = Math


// Условные обозначения:
//
// O  - (Origin) точка начала луча.
//      Обычно это позиция камеры или глаз наблюдателя в 3D-сцене.
//      Из нее исходит луч, проходящий через пиксель экрана
//      в сцену.
//
// D  - (Direction) вектор направления луча.
//      Обычно это нормализованное направление исходящего
//      или входящего луча в трассировке.
//
// P  - (Point) точка пересечения луча с поверхностью объекта.
//      Конкретная точка на объекте, где происходит вычисление
//      освещения или отражения.
//
// V  - (View) вектор направления взгляда,
//      или направления к наблюдателю (камера).
//      Обычно направлен от точки P к камере.
//
// N  - (Normal) нормаль к поверхности в точке (P).
//      Вектор, перпендикулярный поверхности, который используется
//      для вычисления углов падения и отражения света.
//
// L  - (Light) вектор направления на источник света.
//      Направлен от точки P к источнику света.
//
// R  - (Reflection) вектор отраженного луча.
//      Рассчитывается как отражение вектора L
//      относительно нормали N.
//
// CO - (Distance) расстояние от камеры до центра объекта.
//
// .  - (Projection) проекция точки из 3-d пространства
//      на двумерные координты экрана


class Raytracer {

  constructor() {
    this.Origin     = new Vec3(0, 0, 0) // O
    this.Direction  = new Vec3(0, 0, 0) // D
    this.Point      = new Vec3(0, 0, 0) // P
    this.View       = new Vec3(0, 0, 0) // V
    this.Normal     = new Vec3(0, 0, 0) // N
    this.Light      = new Vec3(0, 0, 0) // L
    this.Reflection = new Vec3(0, 0, 0) // R
    this.Distance   = new Vec3(0, 0, 0) // CO
    this.Projection = new Vec3(0, 0, 0) // .
    this.t_min      = 0
    this.t_max      = 0
  }

  reflectRay(ray, normal, n_dot_r = null) {

    if (n_dot_r === null) {
      n_dot_r = normal.dot(ray)
    }

    return normal.clone()
                 .scale(2 * n_dot_r)
                 .sub(ray)
                 .normalize()
  }

  // specular
  // list of lights
  computeLighting(s, scene) {

    let i = 0

    for (const light of scene.lights) {

      if (light.type === 'ambient') {          // окружающий свет
        i += light.intensity                   // aka рассеянный
        continue                               // или равномерный
      }

      else if (light.type === 'point') {       // источник
        this.Light.copyFrom(light.position)    // точечного света
                  .sub(this.Point)
                  .normalize()
      }

      else if (light.type === 'directional') { // источник
        this.Light.copyFrom(light.direction)   // направленного
                  .normalize()                 // света
      }

      else {
        console.error(
          `${ light.type } is an incorrect type of lighting.`)
        continue
      }


      // Проверка теней

      const [shadow_t, shadow_sphere] =
        this.closestIntersection(
          this.Point, this.Light, scene, .001, this.t_max)

      if (shadow_sphere !== null) {
        continue
      }


      // диффузное освещение матовой поверхности

      const n_dot_l = this.Normal.dot(this.Light)

      if (n_dot_l > 0) {
        i += light.intensity * n_dot_l
      }


      // зеркальное освещение (отражение)

      if (s !== -1) {

        this.reflectRay(this.Light, this.Normal, n_dot_l)
        const r_dot_v = this.Reflection.dot(this.View)

        if (r_dot_v > 0) {
          i += light.intensity * pow(r_dot_v, s)
        }

      } // if (s !== -1)

    }

    return i > 1 ? 1 : i
  }

  //canvasToViewport(x, y, sx, sy) {
  //  const d = 1
  //  this.Projection.set(x * sx, -y * sy, d)
  //}

  intersectRaySphere(point, direction, sphere) {

    this.Distance.copyFrom(point)
                 .sub(sphere.position)

    const a = direction.dot(direction)
    const b = 2 * this.Distance.dot(direction)
    const c = this.Distance.dot(this.Distance) - sphere.r_pow_2

    const discriminant = b * b - 4 * a * c
    if (discriminant < 0) {
      return [Infinity, Infinity]
    }

    const a2 = a * 2
    const sqrt_discriminant = sqrt(discriminant)

    const t1 = (-b + sqrt_discriminant) / a2
    const t2 = (-b - sqrt_discriminant) / a2

    return [t1, t2]
  }

  // O, D -> light | P, L -> shadow
  closestIntersection(point, direction, scene, t_min, t_max) {

    let closest_t = Infinity
    let closest_sphere = null

    for (const sphere of scene.spheres) {

      const [t1, t2] =
        this.intersectRaySphere(point, direction, sphere)

      if (t1 >= t_min && t1 <= t_max && t1 < closest_t) {
        closest_t = t1
        closest_sphere = sphere
      }

      if ( t2 >= t_min && t2 <= t_max && t2 < closest_t) {
        closest_t = t2
        closest_sphere = sphere
      }
    }

    return [closest_t, closest_sphere]
  }

  traceRay(// point, direction, t_min, t_max,
    scene, recursion_depth) {

    // process spheres

    const [closest_t, closest_sphere] =
      this.closestIntersection(
        this.Origin, this.Direction, scene,
          this.t_min, this.t_max)

    if (closest_sphere === null) {
      return ColorRGBA.Black
    }

    // P = O + closest_t * D
    this.Point.copyFrom(this.Direction)
              .scale(closest_t)
              .add(this.Origin)

    // N = (P - closest_sphere.center) / length(N)
    this.Normal.copyFrom(this.Point)
               .sub(closest_sphere.position)
               .normalize()

    // V = -D
    this.View.copyFrom(this.Direction)
             .negate()

    const intensity = this.computeLighting(
      closest_sphere.specular, scene)


    // получаем локальный цвет
    const local_color = closest_sphere.color.multiply(intensity)

    // если достигается граница рекурсии, либо объект
    // оказывается неотражающим, процесс останавливается

    const r = closest_sphere.reflective

    if (recursion_depth <= 0 || r <= 0) {
      return local_color
    }

    // const mD = direction.clone().negate()
    // R = this.reflectRay(mD, N)

    const reflected_color =
      this.traceRay(// point, direction, 
        scene, recursion_depth - 1)

    return local_color

  }

  run(scene, gc) { // traceScene

    const { floor } = Math
    const { width, height } = gc.buffer

    const hWidth = floor(width * .5)
    const hHeight = floor(height * .5)

    const xMin = -hWidth
    const yMin = -hHeight
    const xMax = xMin + width
    const yMax = yMin + height

    const aspectRatio = width / height
    const sy = 1 / height
    const sx = aspectRatio / width

    const d = 1

    for (let y = yMin; y < yMax; ++y) {
      for (let x = xMin; x < xMax; ++x) {

        this.Origin.copyFrom(scene.camera)

        // canvasToViewPort
        this.Projection.set(x * sx, -y * sy, d)

        this.Direction.copyFrom(this.Projection)
                      .normalize()

        this.t_min = 1
        this.t_max = Infinity

        const color = this.traceRay(scene)

        gc.putPixel(x, y, color)
      }
    }

  }

}

export default Raytracer
