class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    return new Vector2(this.x / len, this.y / len);
  }

  rotate(angle) {
    const rad = angle * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    );
  }

  angle_between(vector) {
    const dot = this.dot(vector);
    const len1 = this.length();
    const len2 = vector.length();
    const cosTheta = dot / (len1 * len2);
    return Math.acos(cosTheta) * (180 / Math.PI);
  }

  copy() {
    return new Vector2(this.x, this.y);
  }
}

class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vector) {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtract(vector) {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  multiply(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divide(scalar) {
    return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector) {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x,
    );
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const len = this.length();
    return new Vector3(this.x / len, this.y / len, this.z / len);
  }

  copy() {
    return new Vector3(this.x, this.y, this.z);
  }
}

class Mat3 {
  constructor(m) {
    this.m = m;
  }

  multiply(mat) {
    const a = this.m;
    const b = mat.m;
    return new Mat3([
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    ]);
  }

  get_column(index) {
    return new Vector3(this.m[index], this.m[index + 3], this.m[index + 6]);
  }

  copy() {
    return new Mat3(this.m.slice());
  }

  rotate_Z(ang) {
    return this.multiply(
      new Mat3([
        Math.cos(ang),
        -Math.sin(ang),
        0,
        Math.sin(ang),
        Math.cos(ang),
        0,
        0,
        0,
        1,
      ]),
    );
  }
  rotate_Y(ang) {
    return this.multiply(
      new Mat3([
        Math.cos(ang),
        0,
        Math.sin(ang),
        0,
        1,
        0,
        -Math.sin(ang),
        0,
        Math.cos(ang),
      ]),
    );
  }
  rotate_X(ang) {
    return this.multiply(
      new Mat3([
        1,
        0,
        0,
        0,
        Math.cos(ang),
        -Math.sin(ang),
        0,
        Math.sin(ang),
        Math.cos(ang),
      ]),
    );
  }
}

