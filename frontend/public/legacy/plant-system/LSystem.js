// encode strings as numbers for faster processing
// if a grammar contains strings not encoded give them a unique number
const F = 1;
const G = 2;
const f = 3;
const AT = 4;
const PLUS = 5;
const MINUS = 6;
const AND = 7;
const UPTICK = 8;
const BACK_SLASH = 9;
const FORWARD_SLASH = 10;
const BAR = 11;
const POUND = 12;
const EXCLAMATION = 13;
const SINGLE_QUOTE = 14;
const OPEN_CURLY = 15;
const CLOSE_CURLY = 16;
const OPEN_BRACKET = 17;
const CLOSE_BRACKET = 18;

class LSystem {
  constructor(
    axiom,
    grammar,
    position,
    direction,
    w,
    c,
    step_size,
    angle,
    w_inc,
    w_iter_inc,
    colors,
    min_w,
  ) {
    this.encoding = {
      F: F,
      G: G,
      f: f,
      "@": AT,
      "+": PLUS,
      "-": MINUS,
      "&": AND,
      "^": UPTICK,
      "\\": BACK_SLASH,
      "/": FORWARD_SLASH,
      "|": BAR,
      "#": POUND,
      "!": EXCLAMATION,
      "'": SINGLE_QUOTE,
      "{": OPEN_CURLY,
      "}": CLOSE_CURLY,
      "[": OPEN_BRACKET,
      "]": CLOSE_BRACKET,
    };
    this.encoding_len = 17 + 2;

    // encode the axiom
    this.current_production = this._encode(axiom);
    this.axiom = [...this.current_production];

    // encode the grammar
    this.grammar = new Grammar();
    for (let [key, prods] of Object.entries(grammar)) {
      this.grammar.rules[this._encode(key)[0]] = [];
      for (let [prod, prob] of prods) {
        let new_prod = this._encode(prod);
        this.grammar.rules[this.encoding[key]].push([new_prod, prob]);
      }
    }

    this.iterations = 0;

    c = new Vector3(c.x / 255, c.y / 255, c.z / 255);

    this.turtle = new Turtle(
      position,
      direction,
      w,
      c,
      step_size,
      angle,
      w_inc,
    );
    this.w = w;
    this.w_iter_inc = w_iter_inc;

    for (let i = 0; i < colors.length; i++) {
      colors[i] = new Vector3(
        colors[i].x / 255,
        colors[i].y / 255,
        colors[i].z / 255,
      );
    }

    this.colors = colors;

    this.draw_mode = 0;
    this.min_w = min_w;

    this.segment_count = 8;
  }

  _encode(str) {
    let encoded = [];
    str = str.split(" ");
    for (let i = 0; i < str.length; i++) {
      if (str[i][0] === "'") {
        let num = str[i].substring(1);
        encoded.push(-parseInt(num));
        continue;
      }
      if (this.encoding[str[i]] === undefined) {
        this.encoding[str[i]] = this.encoding_len++;
      }
      encoded.push(this.encoding[str[i]]);
    }
    return encoded;
  }

  iterate(times = 1) {
    if (times < 1) return;
    let start_time = performance.now();
    this.turtle.w += this.w_iter_inc * times;
    this.turtle.pw = this.turtle.w;
    this.iterations += times;
    let new_production = [];
    for (let i = 0; i < times; i++) {
      for (let j = 0; j < this.current_production.length; j++) {
        const current_char = this.current_production[j];
        const production = this.grammar.produce(current_char);
        new_production.push(...production);
      }

      this.current_production = new_production;
      new_production = [];
    }
    console.log(
      "LSystem.iterate produced " +
        this.current_production.length +
        " characters in " +
        (performance.now() - start_time) +
        "ms",
    );
  }

  // iterator for compressed production
  [Symbol.iterator]() {
    let i = -1;
    let data = this._get_production();
    return {
      next: () => {
        i++;
        if (data[i] === 0) {
          i += 2;
          return { value: [data[i - 1], data[i]], done: i >= data.length };
        } else if (data[i] <= -1) {
          return {
            value: [-data[i] - 1, SINGLE_QUOTE],
            done: i >= data.length,
          };
        } else {
          return { value: [1, data[i]], done: i >= data.length };
        }
      },
    };
  }

  // compressed production
  // characters are generally repeated many times
  // so if a character is repeated more than once insert 0, count, character
  // 0 indicates the next two values are a count and character
  // otherwise just insert the character
  _get_production() {
    let production = [];

    let i = 0;
    while (i < this.current_production.length) {
      let count = 1;
      let char = this.current_production[i];
      while (
        i + 1 < this.current_production.length &&
        char === this.current_production[i + 1]
      ) {
        count++;
        i++;
      }
      if (count > 1) {
        production.push(0);
        production.push(count);
        production.push(char);
      } else {
        production.push(char);
      }
      i++;
    }

    return production;
  }

  reset() {
    this.current_production = [...this.axiom];
    this.iterations = 0;
    this.turtle.w = this.w;
    this.turtle.pw = this.w;
  }

  get_mesh(draw_mode = 0) {
    let start_time = performance.now();
    this.turtle.push();
    let cyl_vertices = [];
    let cyl_colors = [];
    let mesh = [];
    let colors = [];
    let positions = [];
    let filling = false;
    let prev = true;
    for (const [count, char] of this) {
      switch (char) {
        case F:
        case G:
          if ((draw_mode === 0 || draw_mode === 1) && prev) {
            const verts = this._get_cyl_verts();
            cyl_vertices.push(...verts);
            cyl_colors.push(this.turtle.c);
          }
          const start_pos = this.turtle.position.copy();
          this.turtle.forward(count);
          if (draw_mode === 0 || draw_mode === 1) {
            const verts = this._get_cyl_verts();
            cyl_vertices.push(...verts);
            cyl_colors.push(this.turtle.c);
          }
          if (draw_mode === 2) {
            mesh.push(start_pos.x, start_pos.y, start_pos.z);
            mesh.push(
              this.turtle.position.x,
              this.turtle.position.y,
              this.turtle.position.z,
            );
            colors.push(
              this.turtle.c.x,
              this.turtle.c.y,
              this.turtle.c.z,
              this.turtle.c.x,
              this.turtle.c.y,
              this.turtle.c.z,
            );
          }
          prev = false;
          if (filling) {
            positions.push(this.turtle.position.copy());
          }
          break;
        case f:
          this.turtle.forward(count);
          if (filling) {
            positions.push(this.turtle.position.copy());
          }
          break;
        case PLUS:
          this.turtle.rotate_Z(count);
          break;
        case MINUS:
          this.turtle.rotate_Z(count, true);
          break;
        case BACK_SLASH:
          prev = true;
          cyl_vertices.push(...Array(this.segment_count).fill(undefined));
          cyl_colors.push(new Vector3(0, 0, 0));
          this.turtle.rotate_X(count);
          break;
        case FORWARD_SLASH:
          prev = true;
          cyl_vertices.push(...Array(this.segment_count).fill(undefined));
          cyl_colors.push(new Vector3(0, 0, 0));
          this.turtle.rotate_X(count, true);
          break;
        case AND:
          this.turtle.rotate_Y(count);
          break;
        case UPTICK:
          this.turtle.rotate_Y(count, true);
          break;
        case OPEN_BRACKET:
          prev = true;
          cyl_vertices.push(...Array(this.segment_count).fill(undefined));
          cyl_colors.push(new Vector3(0, 0, 0));
          this.turtle.push(count);
          break;
        case CLOSE_BRACKET:
          prev = true;
          cyl_vertices.push(...Array(this.segment_count).fill(undefined));
          cyl_colors.push(new Vector3(0, 0, 0));
          this.turtle.pop(count);
          break;
        case POUND:
          this.turtle.inc_w(count);
          break;
        case EXCLAMATION:
          this.turtle.dec_w(count);
          this.turtle.w = Math.max(this.min_w, this.turtle.w);
          break;
        case AT:
          if (this.draw_mode === 0 || this.draw_mode === 1) {
            const m = this._get_sphere_mesh(draw_mode);
            mesh.push(...m);
            for (let i = 0; i < m.length; i += 3) {
              colors.push(this.turtle.c.x, this.turtle.c.y, this.turtle.c.z);
            }
          }
          break;
        case BAR:
          this.turtle.turn_away(count);
          break;
        case SINGLE_QUOTE:
          this.turtle.c = this.colors[count];
          break;
        case OPEN_CURLY:
          filling = true;
          break;
        case CLOSE_CURLY:
          filling = false;
          const m = this._get_polygon_mesh(draw_mode, positions);
          mesh.push(...m);
          for (let i = 0; i < m.length; i += 3) {
            colors.push(this.turtle.c.x, this.turtle.c.y, this.turtle.c.z);
          }
          positions = [];
          break;
      }
    }
    this.turtle.pop();

    // connect cylinder vertices
    for (
      let i = 0;
      i < cyl_vertices.length - this.segment_count;
      i += this.segment_count
    ) {
      let co = cyl_colors[Math.floor(i / this.segment_count)];
      for (let j = 0; j < this.segment_count; j++) {
        const a = cyl_vertices[i + j];
        const b = cyl_vertices[i + ((j + 1) % this.segment_count)];
        const c =
          cyl_vertices[i + this.segment_count + ((j + 1) % this.segment_count)];
        const d = cyl_vertices[i + this.segment_count + j];

        // break in the mesh
        if (
          a === undefined ||
          b === undefined ||
          c === undefined ||
          d === undefined
        ) {
          break;
        }

        if (draw_mode === 0) {
          mesh.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z); // triangle ABC
          mesh.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z); // triangle ACD
          colors.push(co.x, co.y, co.z, co.x, co.y, co.z, co.x, co.y, co.z);
          colors.push(co.x, co.y, co.z, co.x, co.y, co.z, co.x, co.y, co.z);
        } else if (draw_mode === 1) {
          mesh.push(a.x, a.y, a.z, b.x, b.y, b.z); // segment AB
          mesh.push(b.x, b.y, b.z, c.x, c.y, c.z); // segment BC
          mesh.push(c.x, c.y, c.z, d.x, d.y, d.z); // segment CD
          mesh.push(d.x, d.y, d.z, a.x, a.y, a.z); // segment DA
          colors.push(co.x, co.y, co.z, co.x, co.y, co.z);
          colors.push(co.x, co.y, co.z, co.x, co.y, co.z);
          colors.push(co.x, co.y, co.z, co.x, co.y, co.z);
          colors.push(co.x, co.y, co.z, co.x, co.y, co.z);
        }
      }
    }

    console.log(
      "LSystem.get_vertices produced " +
        mesh.length / 9 +
        " triangles in " +
        (performance.now() - start_time) +
        "ms",
    );
    return [mesh, colors];
  }

  _get_polygon_mesh(draw_mode, positions) {
    let mesh = [];
    if (positions.length < 3) {
      return mesh; // not enough points to form a polygon
    }
    if (draw_mode === 0) {
      for (let i = 1; i < positions.length - 1; i++) {
        mesh.push(
          positions[0].x,
          positions[0].y,
          positions[0].z,
          positions[i].x,
          positions[i].y,
          positions[i].z,
          positions[i + 1].x,
          positions[i + 1].y,
          positions[i + 1].z,
        );
      }
    } else if (draw_mode === 1) {
      for (let i = 1; i < positions.length - 1; i++) {
        const a = positions[0];
        const b = positions[i];
        const c = positions[(i + 1) % positions.length];
        mesh.push(a.x, a.y, a.z, b.x, b.y, b.z);
        mesh.push(b.x, b.y, b.z, c.x, c.y, c.z);
        mesh.push(c.x, c.y, c.z, a.x, a.y, a.z);
      }
    } else if (draw_mode === 2) {
      for (let i = 0; i < positions.length; i++) {
        const a = positions[i];
        const b = positions[(i + 1) % positions.length];
        mesh.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    return mesh;
  }

  _get_sphere_mesh(draw_mode) {
    let mesh = [];
    let verts = [];
    const w2 = this.turtle.w / 2;
    const pos = this.turtle.position.copy();
    const ux = this.turtle.direction.get_column(0);
    const uy = this.turtle.direction.get_column(1);
    const uz = this.turtle.direction.get_column(2);

    let top = new Vector3(0, 1, 0).multiply(w2);
    top = new Vector3(ux.dot(top), uy.dot(top), uz.dot(top)).add(pos);
    const p_count = this.segment_count / 2;
    for (let i = 1; i < p_count; i++) {
      const phi = (Math.PI * i) / p_count;
      for (let j = 0; j < this.segment_count; j++) {
        const theta = (2 * Math.PI * j) / this.segment_count;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        const p = new Vector3(x, y, z).multiply(w2);
        verts.push(new Vector3(ux.dot(p), uy.dot(p), uz.dot(p)).add(pos));
      }
    }
    let bottom = new Vector3(0, -1, 0).multiply(w2);
    bottom = new Vector3(ux.dot(bottom), uy.dot(bottom), uz.dot(bottom)).add(
      pos,
    );

    for (let i = 0; i < this.segment_count; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % this.segment_count];
      if (draw_mode === 0) {
        mesh.push(a.x, a.y, a.z, b.x, b.y, b.z, top.x, top.y, top.z); // triangle ABtop
      } else if (draw_mode === 1) {
        mesh.push(a.x, a.y, a.z, b.x, b.y, b.z); // segment AB
        mesh.push(b.x, b.y, b.z, top.x, top.y, top.z); // segment Btop
      }
      const c = verts[verts.length - this.segment_count + i];
      const d =
        verts[
          verts.length - this.segment_count + ((i + 1) % this.segment_count)
        ];
      if (draw_mode === 0) {
        mesh.push(c.x, c.y, c.z, d.x, d.y, d.z, bottom.x, bottom.y, bottom.z); // triangle CDbottom
      } else if (draw_mode === 1) {
        mesh.push(c.x, c.y, c.z, d.x, d.y, d.z); // segment CD
        mesh.push(d.x, d.y, d.z, bottom.x, bottom.y, bottom.z); // segment Dbottom
      }
    }

    for (let i = 0; i < p_count - 2; i++) {
      for (let j = 0; j < this.segment_count; j++) {
        const a = verts[i * this.segment_count + j];
        const b =
          verts[i * this.segment_count + ((j + 1) % this.segment_count)];
        const c =
          verts[(i + 1) * this.segment_count + ((j + 1) % this.segment_count)];
        const d = verts[(i + 1) * this.segment_count + j];

        if (draw_mode === 0) {
          mesh.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z); // triangle ABC
          mesh.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z); // triangle ACD
        } else if (draw_mode === 1) {
          mesh.push(a.x, a.y, a.z, b.x, b.y, b.z); // segment AB
          mesh.push(b.x, b.y, b.z, c.x, c.y, c.z); // segment BC
          mesh.push(c.x, c.y, c.z, d.x, d.y, d.z); // segment CD
          mesh.push(d.x, d.y, d.z, a.x, a.y, a.z); // segment DA
        }
      }
    }
    return mesh;
  }

  _get_cyl_verts() {
    const w2 = this.turtle.w / 2;
    let vertices = [];

    // get top and bottom vertices of the cylinder
    for (let i = 0; i < this.segment_count; i++) {
      const angle = (i / this.segment_count) * (2 * Math.PI);
      const m = this.turtle.direction.rotate_X(angle);
      const h = m.get_column(1);
      vertices.push(h.multiply(w2).add(this.turtle.position));
    }

    return vertices;
  }
}
