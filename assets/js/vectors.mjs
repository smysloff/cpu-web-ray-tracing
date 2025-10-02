
// file: assets/js/vectors.mjs

const { sqrt } = Math

class Vec3 {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }


  // base vector methods

  toArray() {
    return [this.x, this.y, this.z]
  }

  equals(v) {
    return this.x === v.x
        && this.y === v.y
        && this.z === v.z
  }

  getLength() {
    return sqrt(
      this.x * this.x
    + this.y * this.y
    + this.z * this.z)
  }

  distance(v) {
    return this.diff(v).getLength()
  }

  dot(v) {
    return this.x * v.x
         + this.y * v.y
         + this.z * v.z
  }


  // immutable methods

  clone() {
    return new Vec3(this.x, this.y, this.z)
  }

  cross(v) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    )
  }

  sum(v) {
    return new Vec3(
      this.x + v.x,
      this.y + v.y,
      this.z + v.z,
    )
  }

  diff(v) {
    return new Vec3(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z,
    )
  }


  // mutable methods

  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  copyFrom(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }

  normalize() {

    const length = this.getLength()

    if (length === 0) {
      this.x = 0
      this.y = 0
      this.z = 0
    } else {
      this.x /= length
      this.y /= length
      this.z /= length
    }

    return this
  }

  scale(factor) {
    this.x *= factor
    this.y *= factor
    this.z *= factor
    return this
  }

  negate() {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z
    return this
  }

  add(v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  sub(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

}

export { Vec3 }
