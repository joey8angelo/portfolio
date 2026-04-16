import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("threejs_canvas");

// ----------------- SCENE -----------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x82c8e5);
//scene.background = new THREE.Color(0xffffff);

// ----------------- LIGHTS -----------------
const ambientLight = new THREE.AmbientLight(0x404040, 5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.position.set(20, 20, 20);

// const dirLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dirLightHelper);

scene.add(ambientLight);
scene.add(directionalLight);

// ----------------- RENDERER -----------------
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

// ----------------- CAMERA -----------------
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 10, 5);
camera.up.set(0, 0, 1);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 5);

// lock panning to the z axis
controls.addEventListener("change", function () {
  this.target.x = 0;
  this.target.y = 0;
});

// const cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// ------------------ PLANE -----------------
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x3f9b0b });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.position.set(0, 0, 0);
scene.add(plane);

// ------------------ WIREFRAME BUFFER -----------------
const wireframeGeometry = new THREE.BufferGeometry();
const wireframeMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
});
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
wireframe.position.set(0, 0, 0);
scene.add(wireframe);

// ------------------ MESH BUFFER -----------------
const meshGeometry = new THREE.BufferGeometry();
const meshMaterial = new THREE.MeshLambertMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);

let vertices = [];
let colors = [];

let system = my_plant;
let draw_mode = 0;

function update_buffers() {
  if (draw_mode === 0) {
    set_buffer(meshGeometry, mesh, vertices, colors);
    set_buffer(wireframeGeometry, wireframe, [], []);
  } else if (draw_mode === 1 || draw_mode === 2) {
    set_buffer(wireframeGeometry, wireframe, vertices, colors);
    set_buffer(meshGeometry, mesh, [], []);
  }
}

function set_buffer(g, v, verts, colors) {
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.attributes.position.needsUpdate = true;
  g.computeBoundingSphere();
  g.deleteAttribute("normal");
  if (verts.length > 0 && verts.length % 9 === 0) {
    g.computeVertexNormals();
    g.attributes.normal.needsUpdate = true;
  }
}

const text_input = document.getElementById("text_input");
text_input.addEventListener("input", (event) => {
  console.log("Input changed");
  const value = event.target.value;
  try {
    const parsed = JSON.parse(value);
    let new_system = new LSystem(
      parsed.axiom,
      parsed.grammar,
      new Vector3(0, 0, 0),
      new Mat3([0, 0, -1, 0, 1, 0, 1, 0, 0]),
      parsed.start_width,
      new Vector3(135, 62, 35),
      parsed.step_size,
      parsed.angle,
      parsed.width_increment,
      parsed.starting_width_increment,
      parsed.addressable_colors.map((c) => new THREE.Vector3(...c)),
      parsed.min_w,
    );
    if (custom) {
      new_system.iterate(custom.iterations);
    }
    custom = new_system;
    system = custom;
    custom_o = parsed;
    system_select.value = "custom";
    console.log("Custom system loaded:", custom);
    [vertices, colors] = system.get_mesh(draw_mode);
    update_buffers();
  } catch (error) {
    console.error("Invalid JSON:", error);
  }
});

const system_select = document.getElementById("system_select");
system_select.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  console.log(selectedValue);
  if (selectedValue === "my_plant") {
    system = my_plant;
    text_input.value = JSON.stringify(my_plant_o, null, 2);
  } else if (selectedValue === "plant") {
    system = plant;
    text_input.value = JSON.stringify(plant_o, null, 2);
  } else if (selectedValue === "dragon") {
    system = dragon;
    text_input.value = JSON.stringify(dragon_o, null, 2);
  } else if (selectedValue === "sierpinski") {
    system = sierpinski;
    text_input.value = JSON.stringify(sierpinski_o, null, 2);
  } else if (selectedValue === "sierpinski_approx") {
    system = sierpinski_approx;
    text_input.value = JSON.stringify(sierpinski_approx_o, null, 2);
  } else if (selectedValue === "sierpinski_carpet") {
    system = sierpinski_carpet;
    text_input.value = JSON.stringify(sierpinski_carpet_o, null, 2);
  } else if (selectedValue === "koch") {
    system = koch;
    text_input.value = JSON.stringify(koch_o, null, 2);
  } else if (selectedValue === "pentigree") {
    system = pentigree;
    text_input.value = JSON.stringify(pentigree_o, null, 2);
  } else if (selectedValue === "binary") {
    system = binary;
    text_input.value = JSON.stringify(binary_o, null, 2);
  } else if (selectedValue === "bush") {
    system = bush;
    text_input.value = JSON.stringify(bush_o, null, 2);
  } else if (selectedValue === "flower_plant") {
    system = flower_plant;
    text_input.value = JSON.stringify(flower_plant_o, null, 2);
  } else if (selectedValue === "custom") {
    system = custom;
    text_input.value = JSON.stringify(custom_o, null, 2);
  }
  [vertices, colors] = system.get_mesh(draw_mode);
  update_buffers();
});

const draw_mode_select = document.getElementById("draw_mode_select");
draw_mode_select.addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  console.log(selectedValue);
  if (selectedValue === "normal") {
    draw_mode = 0;
  } else if (selectedValue === "wireframe") {
    draw_mode = 1;
  } else if (selectedValue === "skeleton") {
    draw_mode = 2;
  }
  [vertices, colors] = system.get_mesh(draw_mode);
  segments_number.value = system.segment_count;
  update_buffers();
});

const auto_rotate_check = document.getElementById("auto_rotate");
auto_rotate_check.addEventListener("change", (event) => {
  const checked = event.target.checked;
  controls.autoRotate = checked;
});

const whiteout_check = document.getElementById("whiteout");
whiteout_check.addEventListener("change", (event) => {
  const checked = event.target.checked;
  if (checked) {
    scene.background = new THREE.Color(0xffffff);
    scene.remove(plane);
  } else {
    scene.background = new THREE.Color(0x82c8e5);
    scene.add(plane);
  }
});

const segments_number = document.getElementById("segments");
segments_number.addEventListener("input", (event) => {
  const value = parseInt(event.target.value);
  console.log(value);
  if (isNaN(value) || value < 3) {
    return;
  }
  system.segment_count = value;
  [vertices, colors] = system.get_mesh(draw_mode);
  update_buffers();
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    system.iterate();
    [vertices, colors] = system.get_mesh(draw_mode);
  } else if (event.key === "r") {
    system.reset();
    vertices = [];
    colors = [];
  }
  update_buffers();
});

let ptime = performance.now();
function animate() {
  const deltaTime = (performance.now() - ptime) / 1000;
  ptime = performance.now();

  controls.update(deltaTime);

  renderer.render(scene, camera);
}
