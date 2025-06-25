class Turtle {
  constructor(position, direction, w, c, step_size, angle, w_inc) {
    this.position = position;
    this.direction = direction; // matrix [X, Y, Z]
    this.w = w;
    this.pw = w;
    this.c = c;
    this.stack = [];
    // constants
    this.step_size = step_size;
    this.angle = angle;
    this.w_inc = w_inc;
  }

  push(times = 1) {
    for (let i = 0; i < times; i++) {
      this.stack.push({
        position: this.position.copy(),
        direction: this.direction.copy(),
        w: this.w,
        pw: this.pw,
        c: this.c,
      });
    }
  }
  pop(times = 1) {
    let state;
    for (let i = 0; i < times; i++) {
      state = this.stack.pop();
    }
    this.position = state.position;
    this.direction = state.direction;
    this.w = state.w;
    this.pw = state.pw;
    this.c = state.c;
  }
  forward(times = 1) {
    this.position = this.position.add(
      this.direction.get_column(0).multiply(this.step_size * times),
    );
    this.pw = this.w;
  }
  rotate_Z(times = 1, negative = false) {
    this.direction = this.direction.rotate_Z(this._get_ang(times, negative));
  }
  rotate_X(times = 1, negative = false) {
    this.direction = this.direction.rotate_X(this._get_ang(times, negative));
  }
  rotate_Y(times = 1, negative = false) {
    this.direction = this.direction.rotate_Y(this._get_ang(times, negative));
  }
  turn_away(times = 1) {
    this.direction = this.direction.rotate_Z(Math.PI * times);
  }
  _get_ang(times, negative = false) {
    let ang = this.angle * (Math.PI / 180) * times;
    if (negative) {
      ang = -ang;
    }
    return ang;
  }
  inc_w(times = 1) {
    this.pw = this.w;
    this.w += this.w_inc * times;
  }
  dec_w(times = 1) {
    this.pw = this.w;
    this.w -= this.w_inc * times;
  }
  set_color(color) {
    this.c = color;
  }
}

