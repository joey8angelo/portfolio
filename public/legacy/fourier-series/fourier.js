let scale = 100; // zoom scale
let frame = 0;
let startTime = Date.now();
const canvas = document.getElementById("fCanv");
const ctx = canvas.getContext("2d");
const fps = document.getElementById("fps");
let circ;
let vecs; // boolean to draw the vectors
let wv; // boolean to draw the 2D wave
let cent; // boolean to center the screen on the drawing point
const drawingSelect = document.getElementById("drawingType"); // select element for different drawing functions
let drawUser; // boolean to draw the user drawn path
let drawCmPath; // boolean to draw the computed path
let pathDelay; // value between 0 and 1, delays the path by a percentage of the time offset
let drawAx; // boolean to draw the axis
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let centerX = window.innerWidth / 2; // position of the center of the screen in x axis
let centerY = window.innerHeight / 2; // position of the center of the screen in y axis
let offX = centerX; // position of X component of drawing
let offY = centerY; // position of Y component of drawing
let toff; // time offset
let time = 0; // current time between 0 and 1
let pathSize;
let step = 0; // current step in the series
let coefficients = []; // fourier coefficients
let n = []; // coefficient index
let path = []; // path cache
const M = 6; // Group size in path
let wave = []; // wave cache
let t = 0.1; // bezier curve tension
let currentFunction = squareWave; // current drawing function
let vectorCount; // number of vectors to approximate with
let prevDrawingStatus = true; // previous drawing status, used to restore the drawing status after drawing is complete
let mouseX = 0; // current mouse x position
let mouseY = 0; // current mouse y position
let mouse = false; // mouse down status
let userPath = []; // user drawn path

document.getElementById("fCanv").addEventListener(
  "wheel",
  (event) => {
    scale += (event.deltaY * -0.1 * scale) / 100; // scale the zoom based on current zoom scale
    scale = Math.max(scale, 1);
  },
  { passive: true },
);
window.onresize = resized;
function resized() {
  centerX = window.innerWidth / 2;
  centerY = window.innerHeight / 2;
  offX = centerX;
  offY = centerY;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  path = [];
  wave = [];
}
onmousemove = function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
};
canvas.onmousedown = function () {
  mouse = true;
  prevDrawingStatus = drawUser;
  drawUser = true;
  userPath = [];
  captureDrawing();
};
canvas.onmouseup = function () {
  mouse = false;
  drawUser = prevDrawingStatus;
  updateCoefficients(currentFunction);
  path = [];
  wave = [];
};
function captureDrawing() {
  if (mouse) {
    userPath.push((mouseX - offX) / scale, (mouseY - offY) / scale);
    setTimeout(captureDrawing, 1);
  }
}
function functionSelect(val) {
  path = [];
  wave = [];
  if (val == "square") {
    if (window.updateMenu) {
      window.updateMenu(
        `<p>The Fourier Series is an expression of a function as a sum of sines
        and cosines, a trigonometric series. This shows the complex Fourier
        Series for a square wave. If the drawing point looks jittery or the
        path looks weird you may want to increase the path resolution.</p>`,
      );
    }
    coefficients = [];
    n = [];
    for (let i = 1; i < vectorCount * 2; i += 2) {
      coefficients.push([0, 4 / (i * Math.PI)]);
      n.push(i);
    }
    currentFunction = undefined;
  } else if (val == "square2") {
    if (window.updateMenu) {
      window.updateMenu(
        `<p>This shows the real valued step function in the complex plane.</p>`,
      );
    }
    currentFunction = squareWave;
  } else if (val == "heart") {
    if (window.updateMenu) {
      window.updateMenu(
        `<p>Many arbitrary functions cannot be approximated because they have
        infinitely many terms in their series. The heart is an example of a 
        well behaved function where the coefficients needed to approximate it 
        converge to a finite number, adding more terms(vectors) does nothing to 
        the approximation because of this.</p>`,
      );
    }
    currentFunction = heart;
  } else if (val == "square3") {
    if (window.updateMenu) {
      window.updateMenu(
        `<p>The function &fnof;(t) here is defined simply as 
        [[1,1],[1,-1],[-1,-1],[-1,1]]. So from time 0-0.25 the point is 1+i, 
        0.25-.5 is 1-i, 0.5-0.75 is -1-i, and 0.75-1 is -1+i.</p>`,
      );
    }
    currentFunction = square;
  } else if (val == "sin") {
    if (window.updateMenu) {
      window.updateMenu(
        `<p>Another example of a smooth function behaving well, no matter how many 
        terms in the series we add all we need for a sine wave is 2. the real 
        valued position of our drawing is the y axis at time t, where time is 
        acting like the x axis moving the wave in the familiar sine wave fashion.</p>`,
      );
    }
    currentFunction = sin;
  } else {
    if (window.updateMenu) {
      window.updateMenu(
        `<p>Draw a path and see the Fourier Series approximation of it. An 
        arbitrary function is defined with</p><p>
        &fnof;<sub>out</sub>(t)=&sum;c<sub>n</sub>e<sup>-2&pi;it</sup>
        </p><p>We can compute the coefficients 
        with</p><p>
        c<sub>n</sub>=&int;<sub>0</sub><sup>1</sup>&fnof;<sub>in</sub>(t)e<sup>-n2&pi;it</sup>
        </p><p>With these fairly simple functions we 
        can compute the position in the complex plane at time t, where t is 
        between 0 and 1, for the function &fnof;(t), by adding up tip to toe 
        the vectors defined by the computed coefficients.</p>`,
      );
    }
    currentFunction = f;
  }
  return currentFunction;
}

opts.push(
  new check("circ", (v) => {
    circ = v;
  }),
);
opts.push(
  new check("vec", (v) => {
    vecs = v;
  }),
);
opts.push(
  new check("wv", (v) => {
    wv = v;
    wave = [];
  }),
);
opts.push(
  new check("center", (v) => {
    cent = v;
    offX = centerX;
    offY = centerY;
    path = [];
    wave = [];
  }),
);
opts.push(
  new check("drawPath", (v) => {
    drawCmPath = v;
  }),
);
opts.push(
  new check("drawUser", (v) => {
    drawUser = v;
  }),
);
opts.push(
  new numeric(
    "pathD",
    (v) => {
      pathDelay = v;
    },
    { min: 0, max: 100 },
  ),
);
opts.push(
  new check("drawAx", (v) => {
    drawAx = v;
  }),
);
opts.push(
  new numeric(
    "speed",
    (v) => {
      toff = v;
      wave = [];
    },
    { min: 0.0001, max: 0.1 },
  ),
);
opts.push(
  new numeric(
    "res",
    (v) => {
      pathSize = v - (v % 100);
      path = [];
      wave = [];
    },
    { min: 100, max: 10000 },
  ),
);
opts.push(
  new numeric(
    "vcount",
    (v) => {
      vectorCount = v;
      updateCoefficients(functionSelect(drawingSelect.value));
    },
    { min: 1 },
  ),
);
drawingSelect.addEventListener("change", () => {
  updateCoefficients(functionSelect(drawingSelect.value));
});

function optReset() {
  for (let opt of opts) {
    opt.reset();
  }
}

/* Functions */
function comp(val, num) {
  let real = val[0] * Math.cos(num) - val[1] * Math.sin(num);
  let im = val[1] * Math.cos(num) + val[0] * Math.sin(num);
  return [real, im];
}
function sin(n, t) {
  return comp([Math.sin(2 * Math.PI * t), 0], -n * t * Math.PI * 2);
}
function squareWave(n, t) {
  let temp = [0, 0];
  if (t < 0.5) {
    temp = [1, 0];
  }
  if (t > 0.5) {
    temp = [-1, 0];
  }
  return comp(temp, -n * t * Math.PI * 2);
}
function square(n, t) {
  let sq = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ];
  let temp = sq[Math.floor(t * sq.length)];
  if (t == 1) {
    temp = sq[-1];
  }
  return comp(temp, -n * t * Math.PI * 2);
}
function heart(n, t) {
  return comp(
    [
      16 * Math.pow(Math.sin(6.25 * t), 3) * 0.1,
      -0.1 *
        (13 * Math.cos(6.25 * t) -
          5 * Math.cos(12.5 * t) -
          2 * Math.cos(18.75 * t) -
          Math.cos(25 * t)),
    ],
    -n * t * Math.PI * 2,
  );
}
function f(n, t) {
  let temp = [
    userPath[Math.floor(t * (userPath.length / 2)) * 2],
    userPath[Math.floor(t * (userPath.length / 2)) * 2 + 1],
  ];
  if (t == 1) {
    temp = [userPath[-1], userPath[-2]];
  }
  return comp(temp, -n * t * Math.PI * 2);
}

// calculate the position of the drawing at time and position of the coefficient
function fr(ps, tm = time) {
  let num = -n[ps] * tm * Math.PI * 2;
  let real =
    coefficients[ps][0] * Math.cos(num) - coefficients[ps][1] * Math.sin(num);
  let im =
    coefficients[ps][1] * Math.cos(num) + coefficients[ps][0] * Math.sin(num);
  return [real, im];
}

function numericIntegration(fn, start, end, n, st = 0.001) {
  let real = 0;
  let im = 0;
  for (let i = start; i < end; i += st) {
    let temp = fn(n, i + st / 2);
    real += temp[0] * st;
    im += temp[1] * st;
  }
  return [real, im];
}

function updateCoefficients(givenFunction) {
  if (givenFunction == undefined) {
    return;
  }
  coefficients = [];
  n = [];
  for (let i = 0; i < vectorCount; i++) {
    n.push(i);
    coefficients.push(numericIntegration(givenFunction, 0, 1, i));
    if (i) {
      n.push(-i);
      coefficients.push(numericIntegration(givenFunction, 0, 1, -i));
    }
  }
  path = [];
  wave = [];
}

// draw the computed path
function drawPath() {
  if (!drawCmPath) {
    path = [];
    return;
  }
  if (path.length == 0) {
    calcPath();
  }

  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (
    let i = Math.floor(time * pathSize) + (pathDelay / 100) * pathSize;
    i < pathSize + Math.floor(time * pathSize);
    i++
  ) {
    let ps = (i % pathSize) * M; // current pos
    let ps2 = ps + M; // next pos
    if (ps2 >= path.length) {
      ps2 = 0;
    }
    ctx.moveTo(path[ps] * scale + offX, path[ps + 1] * scale + offY);
    ctx.bezierCurveTo(
      path[ps + 2] * scale + offX,
      path[ps + 3] * scale + offY,
      path[ps + 4] * scale + offX,
      path[ps + 5] * scale + offY,
      path[ps2] * scale + offX,
      path[ps2 + 1] * scale + offY,
    );
  }
  ctx.stroke();
}

function drawUserPath() {
  if (userPath.length == 0 || !drawUser) {
    return;
  }
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();

  let m = 2;

  for (let i = 0; i < userPath.length - m; i += m) {
    ctx.moveTo(userPath[i] * scale + offX, userPath[i + 1] * scale + offY);
    ctx.lineTo(userPath[i + 2] * scale + offX, userPath[i + 3] * scale + offY);
    // ctx.bezierCurveTo(userPath[i+2]+offX, userPath[i+3]+offY, userPath[i+4]+offX, userPath[i+5]+offY, userPath[i+6]+offX, userPath[i+7]+offY);
  }
  ctx.stroke();
}

let once = false;
// draw the 2D wave
function drawWave() {
  if (!wv) {
    wave = []; // do not store any wave data if it is not being drawn
    return;
  }
  if (wave.length == 0) {
    calcWave();
  }

  for (let i = 0; i < wave.length; i++) {
    wave[i][1] += toff * 2; // move the wave down
  }

  // set the wave to 0 at the current drawing point(and any points skipped by the time offset)
  for (
    let i = Math.floor(time * pathSize);
    i > Math.floor((time - toff) * pathSize) && i >= 0;
    i--
  ) {
    wave[i][1] = 0;
  }
  if (time == 0 && once) {
    for (let i = pathSize - 1; i > Math.floor((1 - toff) * pathSize); i--) {
      wave[i][1] = 0;
    }
  }

  ctx.beginPath();
  for (let i = 0; i < wave.length - 1; i++) {
    if (Math.abs(wave[i + 1][1] - wave[i][1]) > 1) {
      continue;
    }
    ctx.moveTo(wave[i][0] * scale + offX, wave[i][1] * scale + offY);
    ctx.lineTo(wave[i + 1][0] * scale + offX, wave[i + 1][1] * scale + offY);
  }
  if (Math.abs(wave[pathSize - 1][1] - wave[0][1]) < 1) {
    ctx.lineTo(wave[0][0] * scale + offX, wave[0][1] * scale + offY);
  }
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// draw the vectors and circles
function drawVecCirc() {
  if (!circ && !vecs) {
    return;
  }
  let pos = [0, 0];
  for (let i = 0; i < coefficients.length; i++) {
    if (circ) {
      // create a circle from coefficients centered at the last position
      ctx.beginPath();
      ctx.arc(
        pos[0] * scale + offX,
        pos[1] * scale + offY,
        Math.sqrt(
          Math.pow(coefficients[i][0], 2) + Math.pow(coefficients[i][1], 2),
        ) * scale,
        0,
        2 * Math.PI,
      );
      ctx.strokeStyle = "#363030";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (vecs) {
      // create a line from the last position to the new position
      ctx.beginPath();
      ctx.moveTo(pos[0] * scale + offX, pos[1] * scale + offY);
      ctx.lineTo(
        pos[0] * scale + offX + fr(i)[0] * scale,
        pos[1] * scale + offY + fr(i)[1] * scale,
      );
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // update the position
    let f = fr(i);
    pos[0] += f[0];
    pos[1] += f[1];
  }
}

// calculate the control points for a bezier curve
function getControlPoints(x0, y0, x1, y1, x2, y2) {
  var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  var fa = (t * d01) / (d01 + d12);
  var fb = t - fa;

  var p1x = x1 + fa * (x0 - x2);
  var p1y = y1 + fa * (y0 - y2);

  var p2x = x1 - fb * (x0 - x2);
  var p2y = y1 - fb * (y0 - y2);

  return [p1x, p1y, p2x, p2y];
}

// calculate the control points for a list of points
function calcControl(points) {
  let n = points.length;
  let cp = [];
  let np = [];

  // account for the path looping
  points.push(points[0], points[1], points[2], points[3]);
  points.unshift(points[n - 1]);
  points.unshift(points[n - 1]);
  for (let i = 0; i < n + 2; i += 2) {
    cp = cp.concat(
      getControlPoints(
        points[i],
        points[i + 1],
        points[i + 2],
        points[i + 3],
        points[i + 4],
        points[i + 5],
      ),
    );
  }
  cp = cp.concat(cp[0], cp[1]);
  // add the points and control points to the current path
  for (let i = 2; i < n + 2; i += 2) {
    np.push(
      points[i],
      points[i + 1],
      cp[2 * i - 2],
      cp[2 * i - 1],
      cp[2 * i],
      cp[2 * i + 1],
    );
  }
  return np;
}

// calculate the path
function calcPath() {
  // find x,y coordinates for each point in the path
  path = [];
  for (let i = 0; i < pathSize; i++) {
    let p = [0, 0];
    for (let j = 0; j < coefficients.length; j++) {
      let f = fr(j, i / pathSize);
      p[0] += f[0];
      p[1] += f[1];
    }
    path.push(p[0], p[1]);
  }

  path = calcControl(path);
}

// calculate the 2D wave
function calcWave() {
  if (path.length == 0) {
    calcPath();
  }
  wave = [];
  for (let i = 0; i < pathSize; i++) {
    wave.push([path[(i % pathSize) * M], -1000000]);
  }
}

function drawAxes() {
  if (!drawAx) {
    return;
  }
  // solid lines
  ctx.beginPath();
  ctx.moveTo(offX + scale, offY);
  ctx.lineTo(offX - scale, offY);
  ctx.moveTo(offX, offY + scale);
  ctx.lineTo(offX, offY - scale);
  ctx.strokeStyle = "rgba(255,255,255,0.2";
  ctx.lineWidth = 1;
  ctx.stroke();
  // dashed lines
  ctx.beginPath();
  ctx.moveTo(offX + scale * 2, offY);
  ctx.lineTo(offX + scale, offY);
  ctx.moveTo(offX - scale * 2, offY);
  ctx.lineTo(offX - scale, offY);
  ctx.moveTo(offX, offY + scale * 2);
  ctx.lineTo(offX, offY + scale);
  ctx.moveTo(offX, offY - scale * 2);
  ctx.lineTo(offX, offY - scale);
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  // text
  ctx.fillText("1", offX + scale, offY - 5);
  ctx.fillText("-1", offX - scale, offY - 5);
  ctx.fillText("-i", offX + 5, offY + scale);
  ctx.fillText("i", offX + 5, offY - scale);
}

function animate() {
  // calculate fps
  let now = Date.now();
  frame++;
  if (now - startTime > 1000) {
    let f = (frame / ((now - startTime) / 1000)).toFixed(1);
    startTime = now;
    frame = 0;
    if (fps != undefined) {
      fps.innerHTML = "fps: " + f;
    }
  }

  // clear canvas
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // center the screen on the drawing point
  if (cent && path.length > 0 && isNaN(path[0]) == false) {
    offX = centerX - path[Math.floor(time * pathSize) * M] * scale;
    offY = centerY - path[Math.floor(time * pathSize) * M + 1] * scale;
  }

  // draw the circles and vectors
  drawVecCirc();

  // draw the calculated path
  drawPath();

  // draw the user drawn path
  drawUserPath();

  // draw the 2D wave
  drawWave();

  // draw point
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(
    path[Math.floor(time * pathSize) * M] * scale + offX,
    path[Math.floor(time * pathSize) * M + 1] * scale + offY,
    3,
    0,
    2 * Math.PI,
  );
  ctx.fill();

  drawAxes();

  time += toff;
  if (time >= 1) {
    time = 0;
    once = true;
  }

  requestAnimationFrame(animate);
}

updateCoefficients(functionSelect(drawingSelect.value));
animate();
