export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  // multiply the vector by a scalar
  mult(s: number) {
    this.x *= s;
    this.y *= s;
  }
  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
  }
  // return vectors magnitude
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  // return vectors magnitude squared
  magSq() {
    return this.x * this.x + this.y * this.y;
  }
  // set vectors magnitude
  setMag(m: number) {
    this.normalize();
    this.mult(m);
  }
  // normalize the vector
  normalize() {
    let m = this.mag();
    if (m == 0) {
      return;
    }
    this.x /= m;
    this.y /= m;
  }
  // copy the vector
  copy() {
    return new Vector(this.x, this.y);
  }
  // set the vector given an angle and magnitude
  setFromAngle(a: number, m: number = 1) {
    this.x = m * Math.cos(a);
    this.y = m * Math.sin(a);
  }
}
