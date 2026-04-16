// 2d canvas
const dCanvas = document.getElementById("drawCanv");
let sz = 128;
let multiplier = 50;
let off = 3;
let cSize = sz * multiplier;
dCanvas.width = cSize;
dCanvas.height = cSize;
const dctx = dCanvas.getContext("2d");
dctx.fillStyle = "black";
dctx.fillRect(0, 0, dCanvas.width, dCanvas.height);
let dbutton = document.getElementById("draw");
let ebutton = document.getElementById("erase");
let drawingMode = true;

// 3d background canvas
let bg = document.getElementById("bg");
let mouseDown = false;
bg.addEventListener("mousemove", onPointerMove);
bg.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouseDown = true;
});
bg.addEventListener("mouseup", (e) => {
  if (e.button === 0) mouseDown = false;
});
bg.addEventListener("mousemove", (e) => {
  mouseDown = false;
});

let predC;
let predOpt = new numeric("prediction", (v) => {
  predC = v;
});
let preds = document.querySelectorAll(".pred");

// smaller 28x28 canvas used to compress the larger drawing canvas
const cCanvas = document.getElementById("compCanv");
cCanvas.width = 28;
cCanvas.height = 28;
const cctx = cCanvas.getContext("2d", { willReadFrequently: true });

function drawC() {
  dbutton.classList.add("clicked");
  ebutton.classList.remove("clicked");
  drawingMode = true;
  console.log("Drawing");
}
function eraseC() {
  dbutton.classList.remove("clicked");
  ebutton.classList.add("clicked");
  drawingMode = false;
  console.log("Erasing");
}
function clearC() {
  dctx.fillStyle = "black";
  dctx.fillRect(0, 0, dCanvas.width, dCanvas.height);
  setInputLayer();
}

// update camera and renderer on window resize
window.addEventListener("resize", () => {
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.camera.aspect = window.innerWidth / window.innerHeight;

  window.camera.updateProjectionMatrix();
});

// drawing functions for the 2d canvas
let isDrawing = false;
let radius = 5.4;
let radOpt = new numeric("radius", (v) => {
  radius = v;
});

let lastX;
let lastY;
dCanvas.addEventListener("mousedown", (e) => {
  fillCircle(Math.floor(e.offsetX / off), Math.floor(e.offsetY / off), radius);
  isDrawing = true;
  setInputLayer();
  lastX = Math.floor(e.offsetX / off);
  lastY = Math.floor(e.offsetY / off);
});
dCanvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    fillAlongLine(
      Math.floor(e.offsetX / off),
      Math.floor(e.offsetY / off),
      radius,
    );
    setInputLayer();
    lastX = Math.floor(e.offsetX / off);
    lastY = Math.floor(e.offsetY / off);
  }
});
dCanvas.addEventListener("mouseup", (e) => {
  isDrawing = false;
  cctx.drawImage(dCanvas, 0, 0, cCanvas.width, cCanvas.height);
  setInputLayer();
});
dCanvas.addEventListener("mouseleave", (e) => {
  if (isDrawing) {
    isDrawing = false;
    setInputLayer();
  }
});
let timer = null;
let dh = document.querySelector(".drawHint");
let minR = Number(document.getElementById("radius").min);
dCanvas.addEventListener("wheel", (e) => {
  if (timer !== null) clearTimeout(timer);

  if (e.shiftKey) {
    dh.style.opacity = 0;
    radius -= e.deltaY / 1000;
    radius = Math.max(radius, minR);
    console.log("radius:", radius);
    radOpt.updateDoc(radius.toFixed(2));
    dctx.fillStyle = "black";
    dctx.fillRect(0, 0, dCanvas.width, dCanvas.height);
    fillCircle(64, 64, radius, true);
    timer = setTimeout(() => {
      dctx.fillStyle = "black";
      dctx.fillRect(0, 0, dCanvas.width, dCanvas.height);
      setInputLayer();
    }, 500);
  } else {
    off -= e.deltaY / 1000;
    dCanvas.style.width = off * sz + "px";
    dCanvas.style.height = off * sz + "px";
  }
});

function setInputLayer() {
  cctx.drawImage(dCanvas, 0, 0, cCanvas.width, cCanvas.height);
  let pixels = cctx.getImageData(0, 0, cCanvas.width, cCanvas.height).data;
  let fwd = [];
  for (let i = 0; i < pixels.length; i += 4) {
    fwd.push([
      (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255,
    ]);
    layers[0][i / 4].material.color.setRGB(
      pixels[i] / 255,
      pixels[i + 1] / 255,
      pixels[i + 2] / 255,
    );
  }
  forwardProp(fwd);
}

function fillCircle(x, y, r, drawM = drawingMode) {
  if (!drawM) r *= 2;

  for (let i = x - r; i <= x + r; i++) {
    for (let j = y - r; j <= y + r; j++) {
      if (0 <= i && i < sz && 0 <= j && j < sz) {
        let dx = x - i;
        let dy = y - j;
        if (dx * dx + dy * dy <= r * r) {
          dctx.fillStyle = drawM ? "white" : "black";
          dctx.fillRect(i * multiplier, j * multiplier, multiplier, multiplier);
        }
      }
    }
  }
}

function fillAlongLine(X, Y, r) {
  let dx = Math.abs(X - lastX);
  let sx = lastX < X ? 1 : -1;
  let dy = -Math.abs(Y - lastY);
  let sy = lastY < Y ? 1 : -1;
  let error = dx + dy;

  while (true) {
    fillCircle(lastX, lastY, r);
    if (lastX == X && lastY == Y) break;
    let e2 = 2 * error;
    if (e2 >= dy) {
      if (lastX == X) break;
      error += dy;
      lastX += sx;
    }
    if (e2 <= dx) {
      if (lastY == Y) break;
      error += dx;
      lastY += sy;
    }
  }
}

function dot(A, B) {
  var C = new Array(A.length);
  for (var i = 0; i < A.length; i++) {
    C[i] = new Array(B[0].length);
    for (var j = 0; j < B[0].length; j++) {
      C[i][j] = 0;
      for (var k = 0; k < A[0].length; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function onPointerMove(event) {
  window.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  window.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

let INTERSECTED;
let SELECTED;
let startTime = 0;
let frame = 0;
let fps = document.getElementById("fps");

// main animation loop
function animate() {
  let time = Date.now();
  frame++;
  if (time - startTime > 500) {
    let f = (frame / ((time - startTime) / 500)).toFixed(1);

    if (fps != undefined) fps.innerHTML = f;

    startTime = time;
    frame = 0;
  }

  window.raycaster.setFromCamera(pointer, camera); // update the picking ray with the camera and mouse position
  const intersects = window.raycaster.intersectObjects(layers.flat()); // calculate objects intersecting the picking ray choosing only from the layers array
  if (intersects.length > 0) {
    // if any intersections are found
    document.body.style.cursor = "pointer"; // change the cursor to a pointer
    if (INTERSECTED != intersects[0].object) {
      // if the object is different from the last one
      if (INTERSECTED)
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex); // set the color of the previous object back to its original color
      INTERSECTED = intersects[0].object; // set the new object to the intersected object
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex(); // store the current color of the object
      INTERSECTED.material.color.setHex(0xff0000); // set the color of the object to red
    }
  } else {
    // if no intersections are found
    document.body.style.cursor = "auto"; // set the cursor back to the default
    if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex); // set the color of the previous object back to its original color
    INTERSECTED = null; // set the intersected object to null
  }
  if (mouseDown && INTERSECTED != null) {
    // if the mouse is down and an object is intersected
    if (SELECTED === INTERSECTED) {
      // if the selected object is the same as the intersected object
      SELECTED = null; // set the selected object to null
    } else {
      SELECTED = INTERSECTED; // set the selected object to the intersected object
    }
    window.drawWeights(SELECTED); // redraw the weights connected to the selected object
    mouseDown = false; // don't keep looping while mouse is pressed
  }

  window.renderer.render(window.scene, window.camera);
  requestAnimationFrame(animate);
}

// forward propagation
function forwardProp(input) {
  let output = input;
  for (let i = 0; i < layers.length - 1; i++) {
    output = activation(add(dot(weights[i], output), biases[i]), i);
    for (let j = 0; j < output.length; j++) {
      for (let k = 0; k < output[j].length; k++) {
        layers[i + 1][j].material.color.setHSL(0, 0, output[j][k] * 0.5);
      }
    }
  }

  output = output.flat();
  for (let i = 0; i < output.length; i++) {
    output[i] = [output[i], i];
  }
  output.sort((a, b) => b[0] - a[0]);

  for (let i = 0; i < preds.length; i++) {
    if (i < predC)
      preds[i].innerHTML =
        output[i][1] + ": " + (output[i][0] * 100).toFixed(2) + "%";
    else preds[i].innerHTML = "";
  }
}

// broadcasting assumes A is larger than B for simplicity for all element wise operations
// which is not a correct assumption in general
function add(A, B) {
  let r = B.length;
  let c = B[0].length;
  let C = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    C[i] = new Array(A[i].length);
    for (let j = 0; j < A[i].length; j++) {
      C[i][j] = A[i][j] + B[i % r][j % c];
    }
  }
  return C;
}
function sub(A, B) {
  let r = B.length;
  let c = B[0].length;
  let C = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    C[i] = new Array(A[i].length);
    for (let j = 0; j < A[i].length; j++) {
      C[i][j] = A[i][j] - B[i % r][j % c];
    }
  }
  return C;
}
function exp(A) {
  let C = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    C[i] = new Array(A[i].length);
    for (let j = 0; j < A[i].length; j++) {
      C[i][j] = Math.exp(A[i][j]);
    }
  }
  return C;
}
function div(A, B) {
  let r = B.length;
  let c = B[0].length;
  let C = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    C[i] = new Array(A[i].length);
    for (let j = 0; j < A[i].length; j++) {
      C[i][j] = A[i][j] / B[i % r][j % c];
    }
  }
  return C;
}
function maxCol(A) {
  let ret = [new Array(A[0].length)];
  for (let i = 0; i < A[0].length; i++) {
    let max = A[0][i];
    for (let j = 1; j < A.length; j++) {
      if (A[j][i] > max) max = A[j][i];
    }
    ret[0][i] = max;
  }
  return ret;
}
function sumCol(A) {
  let ret = [new Array(A[0].length)];
  for (let i = 0; i < A[0].length; i++) {
    let sum = 0;
    for (let j = 0; j < A.length; j++) {
      sum += A[j][i];
    }
    ret[0][i] = sum;
  }
  return ret;
}
function activation(input, type) {
  if (type == 2) {
    // softmax
    let ex = exp(sub(input, maxCol(input)));
    return div(ex, sumCol(ex));
  } else {
    let t = input;
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        if (input[i][j] < 0) t[i][j] = 0.01 * input[i][j];
        else t[i][j] = input[i][j];
      }
    }
    return t;
  }
}

setInputLayer();
animate();

