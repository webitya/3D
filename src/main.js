import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { gsap } from 'gsap';

let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let isAnimating = true;

const scene = new THREE.Scene();

const initialCameraPosition = new THREE.Vector3(1.48, 10, 2.95);
const targetCameraPosition = new THREE.Vector3(1.48, 4.88, 2.95);
const initialLookAtTarget = new THREE.Vector3(0, 20, 0);
const cameraTarget = new THREE.Vector3(1.74, 6.02, 0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(initialCameraPosition);
camera.lookAt(initialLookAtTarget);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 15);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
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

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outlinePass.edgeStrength = 2.5;
    outlinePass.edgeGlow = 0.0;
    outlinePass.edgeThickness = 1.0;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#000000');
    composer.addPass(outlinePass);

    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(
        1 / (window.innerWidth * window.devicePixelRatio),
        1 / (window.innerHeight * window.devicePixelRatio)
    );
    composer.addPass(fxaaPass);

    animateCamera(() => {
        const overlayContainer = document.getElementById('overlay-container');
        if (overlayContainer) {
            overlayContainer.style.display = 'flex';
        }
    });
    animate(composer);
    setupEventListeners();
}, undefined, (error) => {
    console.error('An error occurred while loading the GLB model:', error);
});

function animateCamera(callback) {
    gsap.timeline()
        .to(camera.position, {
            duration: 0.5,
            y: targetCameraPosition.y,
            ease: "power2.inOut",
            onUpdate: () => camera.lookAt(initialLookAtTarget)
        })
        .to(initialLookAtTarget, {
            duration: 1,
            x: cameraTarget.x,
            y: cameraTarget.y,
            z: cameraTarget.z,
            ease: "power2.inOut",
            onUpdate: () => camera.lookAt(initialLookAtTarget),
            onComplete: () => {
                isAnimating = false;
                if (callback) callback();
            }
        });
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);

    const centerButton = document.querySelector('#center-button');
    if (centerButton) {
        centerButton.addEventListener('click', () => {
            alert('Centered button clicked!');
            // Additional functionality can be added here
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    fxaaPass.uniforms['resolution'].value.set(
        1 / (window.innerWidth * window.devicePixelRatio),
        1 / (window.innerHeight * window.devicePixelRatio)
    );
}

function onMouseMove(event) {
    if (isAnimating) return;

    const parallaxAmount = 0.0005;
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
    updateCameraInfo();
    composer.render();
}

function updateCameraInfo() {
    const info = document.getElementById('camera-info');
    if (info) {
        info.innerHTML = `
            Position: ${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}<br>
            LookAt: ${initialLookAtTarget.x.toFixed(2)}, ${initialLookAtTarget.y.toFixed(2)}, ${initialLookAtTarget.z.toFixed(2)}
        `;
    }
}

// Fade in animation for sections
document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fadeIn');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInVisible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});

// Intro section
window.addEventListener('scroll', function() {
    const title = document.getElementById('site-title');
    const navBar = document.querySelector('.nav-bar');
    const scrollPosition = window.scrollY;

    if (title && navBar) {
        if (scrollPosition > 100) {
            title.style.transform = 'scale(0.5) translate(200%, -200%)';
            title.style.fontSize = '2rem';
            navBar.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        } else {
            title.style.transform = 'scale(1) translate(0, 0)';
            title.style.fontSize = '4rem';
            navBar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
    }
});

// View more to about section
document.addEventListener("DOMContentLoaded", function() {
    // IntersectionObserver for fade-in
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInVisible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fadeIn').forEach(section => {
        observer.observe(section);
    });

    // Scroll to About section on "View More" click
    const viewMoreButton = document.querySelector('.View-more');
    const aboutSection = document.querySelector('.about-me');

    if (viewMoreButton && aboutSection) {
        viewMoreButton.addEventListener('click', function() {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Reactive Eye
var canvas = document.getElementById("canvas");
if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");

    var size = 300;
    canvas.width = size;
    canvas.height = size;

    var eyeX = canvas.width / 2;
    var eyeY = canvas.height / 2;
    var eyeRadius = size * 0.13;
    var pupilRadius = size * 0.06;

    function drawEye(ctx, pupilX, pupilY) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#000000';
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

        // Draw pupil
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, pupilRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
    }

    document.addEventListener("mousemove", function(event) {
        var rect = canvas.getBoundingClientRect();

        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        var dx = mouseX - eyeX;
        var dy = mouseY - eyeY;

        var distance = Math.sqrt(dx * dx + dy * dy);

        var angle = Math.atan2(dy, dx);

        var maxDistance = eyeRadius - pupilRadius;
        if (distance > maxDistance) {
            distance = maxDistance;
        }

        var pupilX = eyeX + Math.cos(angle) * distance;
        var pupilY = eyeY + Math.sin(angle) * distance;

        drawEye(ctx, pupilX, pupilY);
    });

    drawEye(ctx, eyeX, eyeY);
}

// Scroll container
const scrollContainer = document.querySelector('.scroll-container');

if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
    });
}

// Menu functions
function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    document.querySelector('.mobile-menu').classList.toggle('open');
}
function toggleMenu() {
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    fullscreenMenu.classList.toggle('open');

    document.body.style.overflow = 'auto';
}
function handleMenuToggleKey(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        toggleMenu();
    } else if (event.key === 'Escape') {
        const fullscreenMenu = document.getElementById('fullscreen-menu');
        if (fullscreenMenu.classList.contains('open')) {
            fullscreenMenu.classList.remove('open');
        }
    }
}
