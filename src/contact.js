import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Reactive Eye
var canvas = document.getElementById("canvas");
var canvasRight = document.getElementById("canvas-right");

var ctx = canvas.getContext("2d");
var ctxRight = canvasRight.getContext("2d");

var size = 157.5; // Half of the original size
canvas.width = size;
canvas.height = size;
canvasRight.width = size;
canvasRight.height = size;

var eyeX = canvas.width / 2;
var eyeY = canvas.height / 2;
var eyeRadius = size * 0.13; // Adjusted proportionally to the size
var pupilRadius = size * 0.06; // Adjusted proportionally to the size

function drawEye(ctx, pupilX, pupilY) {
    ctx.strokeStyle = '#D9D9D9';
    ctx.lineWidth = 2;

    // Ellipse 3
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY - size * 0.183, size * 0.32, size * 0.32, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Ellipse 5
    ctx.beginPath();
    ctx.ellipse(eyeX + size * 0.183, eyeY, size * 0.32, size * 0.32, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();

    // Ellipse 4
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY + size * 0.183, size * 0.32, size * 0.32, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Ellipse 6
    ctx.beginPath();
    ctx.ellipse(eyeX - size * 0.183, eyeY, size * 0.32, size * 0.32, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();

    // Ellipse 7
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, size * 0.135, size * 0.135, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Rectangle 1
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.stroke();

    // Draw pupil
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, pupilRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}

document.addEventListener("mousemove", function(event) {
    var rect = canvas.getBoundingClientRect();
    var rectRight = canvasRight.getBoundingClientRect();

    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var mouseXRight = event.clientX - rectRight.left;
    var mouseYRight = event.clientY - rectRight.top;

    var dx = mouseX - eyeX;
    var dy = mouseY - eyeY;
    var dxRight = mouseXRight - eyeX;
    var dyRight = mouseYRight - eyeY;

    var distance = Math.sqrt(dx * dx + dy * dy);
    var distanceRight = Math.sqrt(dxRight * dxRight + dyRight * dyRight);

    var angle = Math.atan2(dy, dx);
    var angleRight = Math.atan2(dyRight, dxRight);

    var maxDistance = eyeRadius - pupilRadius;
    if (distance > maxDistance) {
        distance = maxDistance;
    }
    if (distanceRight > maxDistance) {
        distanceRight = maxDistance;
    }

    var pupilX = eyeX + Math.cos(angle) * distance;
    var pupilY = eyeY + Math.sin(angle) * distance;
    var pupilXRight = eyeX + Math.cos(angleRight) * distanceRight;
    var pupilYRight = eyeY + Math.sin(angleRight) * distanceRight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);

    drawEye(ctx, pupilX, pupilY);
    drawEye(ctxRight, pupilXRight, pupilYRight);
});

drawEye(ctx, eyeX, eyeY);
drawEye(ctxRight, eyeX, eyeY);

// 3D Scene
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let isAnimating = false;

const scene = new THREE.Scene();

const targetCameraPosition = new THREE.Vector3(1.48, 4.88, 2.95);
const cameraTarget = new THREE.Vector3(1.74, 6.5, 0);

const camera = new THREE.PerspectiveCamera(75, 1440 / 250, 0.1, 1000);
camera.position.copy(targetCameraPosition);  // Set camera directly at the target position
camera.lookAt(cameraTarget);  // Set the look at target directly

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1440, 250);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const loader = new GLTFLoader();
loader.load('/assets/city.glb', (gltf) => {
    const city = gltf.scene;
    city.scale.set(1, 1, 1);
    scene.add(city);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const outlinePass = new OutlinePass(new THREE.Vector2(1440, 250), scene, camera);
    outlinePass.edgeStrength = 2.5;
    outlinePass.edgeGlow = 0.0;
    outlinePass.edgeThickness = 1.0;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#000000');
    composer.addPass(outlinePass);

    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(1 / (1440 * window.devicePixelRatio), 1 / (250 * window.devicePixelRatio));
    composer.addPass(fxaaPass);

    animate(composer);
    setupEventListeners();
}, undefined, (error) => {
    console.error('An error occurred while loading the GLB model:', error);
});

function setupEventListeners() {
    document.addEventListener('mousemove', onMouseMove, false);
    document.getElementById('threejs-link').addEventListener('click', handleTransition);
}

function onMouseMove(event) {
    if (isAnimating) return;

    const parallaxAmount = 0.005;
    const deltaX = (event.clientX - windowHalfX) * parallaxAmount;
    const deltaY = (event.clientY - windowHalfY) * parallaxAmount;

    camera.position.set(
        targetCameraPosition.x + deltaX,
        targetCameraPosition.y + deltaY,
        targetCameraPosition.z
    );
    camera.lookAt(cameraTarget);
}

function animate(composer) {
    requestAnimationFrame(() => animate(composer));
    composer.render();
}

function shrink(e) {
    const el = e.target;
    // Trigger browser reflow to start animation
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
    el.classList.add("shrink-down");
}

function toggleFullScreen(e) {
    e.preventDefault();
    const { top, left } = e.target.getBoundingClientRect();

    let fullScreen = e.target.cloneNode(true);

    fullScreen.style.setProperty("--inset", `${top}px auto auto ${left}px`);
    fullScreen.classList.add("full-screen");

    fullScreen.addEventListener("click", shrink);

    document.body.appendChild(fullScreen);
}

// Function to handle the transition
async function handleTransition(event) {
    event.preventDefault();
    const container = document.getElementById('threejs-container');

    // Animate the container to full screen
    const { top, left } = container.getBoundingClientRect();

    let fullScreen = container.cloneNode(true);

    fullScreen.style.setProperty("--inset", `${top}px auto auto ${left}px`);
    fullScreen.classList.add("full-screen");

    document.body.appendChild(fullScreen);

    // Preload index.html content
    const response = await fetch('index.html');
    const html = await response.text();

    // Wait for the animation to complete
    fullScreen.addEventListener("animationend", () => {
        // Replace the content of the current page with index.html content
        document.open();
        document.write(html);
        document.close();
    });
}

document.getElementById('threejs-link').addEventListener('click', handleTransition);
