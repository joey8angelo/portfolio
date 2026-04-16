import * as THREE from 'three';
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { LineGeometry } from 'https://unpkg.com/three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'https://unpkg.com/three/examples/jsm/lines/LineMaterial.js';
import { Line2 } from 'https://unpkg.com/three/examples/jsm/lines/Line2.js';


let threshold = 0.4;
let weightsM = structuredClone(weights);

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3d3d39);
export const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer(
    {
        canvas: document.querySelector('#bg'),
    }
);
export const raycaster = new THREE.Raycaster();
export const pointer = new THREE.Vector2();
export let SELECTED = null;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// initial camera position
camera.position.set(30, -10, 30)

// camera.lookAt(new THREE.Vector3(0, 0, 0));

// lights
// const pointLight = new THREE.PointLight(0xffffff, 1000);
// pointLight.position.set(-10,-10,-10);
// scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(-14, -14, 14);
controls.update();

// input layer of network
export let layers = [];
let layer = [];
const inputLayerGeometry = new THREE.BoxGeometry(1, 1, 1);
for(let i = 0; i < 784; i++){
    layer.push(new THREE.Mesh(inputLayerGeometry, new THREE.MeshStandardMaterial({color: 0x000000})));
    layer[i].position.set(-i%28, -Math.floor(i/28), 0);
}
layers.push(layer);
// hidden layers 1 and 2
let hiddenLayerGeometry = new THREE.SphereGeometry();
layer = [];
let hiddenLayers = 2;
let hlp = 10;
for(let i = 0; i < hiddenLayers; i++){
    layer = [];
    for(let j = 0; j < 16; j++){
        layer.push(new THREE.Mesh(hiddenLayerGeometry, new THREE.MeshStandardMaterial({color: 0x000000})));
        layer[j].position.set(-((j%4 * 5) + 6), -((Math.floor(j/4) * 5) + 6), hlp);
    }
    layers.push(layer);
    hlp += 10;
}
// output layer
let outputLayerGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
// let loader = new FontLoader();
layer = [];
for(let i = 0; i < 10; i++){
    layer.push(new THREE.Mesh(outputLayerGeometry, new THREE.MeshStandardMaterial({color: 0x000000})));
    layer[i].position.set(-14, -((i%10 * 2)+4.5), 30);

    // loader.load('font/martianMono.json', function(font){
    //     let textGeometry = new TextGeometry(i.toString(), {
    //         font: font,
    //         size: 0.5,
    //         height: 0.1,
    //     });
    //     let textMaterial = new THREE.MeshStandardMaterial({color: 0x000000});
    //     let text = new THREE.Mesh(textGeometry, textMaterial);
    //     text.position.set(-15, -((i%10 * 2)+4.5), 30);
    //     scene.add(text);
    // });
}
layers.push(layer);

// add layers to scene
for(let i = 0; i < layers.length; i++){
    scene.add(...layers[i]);
}

// create Line2 objects for weights
for(let i = 0; i < layers.length-1; i++){
    for(let j = 0; j < layers[i].length; j++){
        for(let k = 0; k < layers[i+1].length; k++){
            let color = 0x00ff55;
            if(weightsM[i][k][j] < 0){
                weightsM[i][k][j] *= -1;
                color = 0xff2f00;
            }
            const lineG = new LineGeometry();
            lineG.setPositions([layers[i][j].position.x, layers[i][j].position.y, layers[i][j].position.z, layers[i+1][k].position.x, layers[i+1][k].position.y, layers[i+1][k].position.z]);
            weightsM[i][k][j] = new Line2(lineG, new LineMaterial({color: color, linewidth: weightsM[i][k][j]*5}));
            weightsM[i][k][j].connectedTo = [layers[i][j], layers[i+1][k]];
        }
    }
}

// add threshold option
new numeric("threshold", (v)=>{ threshold = v; drawWeights(); });


// add/remove the weights to the scene
export function drawWeights(selected = null){
    for(let i = 0; i < weightsM.length; i++){
        for(let j = 0; j < weightsM[i].length; j++){
            for(let k = 0; k < weightsM[i][j].length; k++){
                if(selected == null){
                    if(weightsM[i][j][k].material.linewidth/5 > threshold)
                        scene.add(weightsM[i][j][k]);
                    else
                        scene.remove(weightsM[i][j][k]);
                } else {
                    if(weightsM[i][j][k].connectedTo.includes(selected))
                        scene.add(weightsM[i][j][k]);
                    else
                        scene.remove(weightsM[i][j][k]);
                }
            }
        }
    }
}