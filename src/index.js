import * as THREE from '../vendor/three/build/three.module.js';
import { OrbitControls } from '../vendor/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from '../vendor/three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../vendor/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from '../vendor/three/examples/jsm/postprocessing/GlitchPass.js';

import { Particle, DigitalRain } from './particles.js';
import { sfx } from './sfx.js';
import { animate, lerp, EasingFunctions } from './animations.js';
import { ui } from './ui.js'
import { getSquare } from './SpaceFlight.js';

const canvas = document.querySelector('#canvas');

/* Renderer setup */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

/* Setup postprocessing */
const composer = new EffectComposer(renderer);
/* Creates the GlitchPass post-processing effect */
const glitch = new GlitchPass();
glitch.enabled = false;
composer.addPass(glitch);
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0, 0.5, 0);
bloom.renderToScreen = true;
composer.addPass(bloom);

/* Enable below for a cool glitch effect everytime mouse moves.
window.addEventListener("mousemove", (event) => {
    glitch.curF = 0;
});
*/

/* Create scene */
const scene = new THREE.Scene();
let sceneStage = 'intro';
//scene.background = new THREE.Color(0xffffff);
scene.background = new THREE.Color(0x000000);

renderer.setRenderTarget(composer.readBuffer);
scene.onAfterRender = () => {
    composer.render();
};

ui.setupListeners(startConstruct);

/* Setup camera */
let landscapeFOV = 20;
let portraitFOV = 70;
let landscapeInitialCameraPosition = { x: -7.6, y: 1.3, z: -7.6 };
let portraitInitialCameraPosition = { x: -4, y: 1.5, z: -4 };
const aspect = canvas.clientWidth / canvas.clientHeight;
const fov = aspect >= 1 ? landscapeFOV : portraitFOV;
let pos = aspect >= 1 ? landscapeInitialCameraPosition : portraitInitialCameraPosition;
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 500);
/*camera.position.set(pos.x, pos.y, pos.z);
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(0, 0.6, 0);*/
camera.position.set(0, 2, 5);


window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);

    camera.aspect = w / h;
    camera.fov = camera.aspect >= 1 ? landscapeFOV : portraitFOV;

    /* On the intro screen, position needs adjusting too */
    if (sceneStage === 'intro') {
        const pos = camera.aspect >= 1 ? landscapeInitialCameraPosition : portraitInitialCameraPosition;
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(0, 0.6, 0);
    }
    camera.updateProjectionMatrix();
});

/* Start loading assets */
const sfxPromise = sfx.load();
const loadPromise = animate(1000, 30, (p) => ui.updateProgress(p));
Promise.all([sfxPromise, loadPromise]).then(() => {
    sfx.setupEffects(camera);

    ui.hideProgress();
    setTimeout(() => ui.fadeIn(), 600);
});

/* Throttled render loop for the intro screen */
let introRender = null;
function introRenderLoop(maxFPS = 5) {
    const interval = 1000 / maxFPS;
    let lastRun = 0;
    const loop = (now) => {
        if (now - lastRun >= interval) {
            renderer.render(scene, camera);
            lastRun = now;
        }
        introRender = requestAnimationFrame(loop);
    };
    introRender = requestAnimationFrame(loop);
}

function renderLoop() {
    renderer.setAnimationLoop((time) => {
        if (sceneStage === 'construct' && squares) {
            squares.forEach((square) => square.update());
            camera.rotation.z += 0.01;
        }
        if (drops) {
            drops.update(time);
        }
        if (controls) {
            controls.update();
        }
        renderer.render(scene, camera);
    });
}

/* Start render loop */
introRenderLoop();

let squares;
let controls;
let drops;
const dolly = new THREE.Group();

function startConstruct() {
    sceneStage = 'construct';

    glitch.enabled = true;

    /* Use different FOV in the construct */
    landscapeFOV = 70;
    portraitFOV = 110;

    ui.hideOverlay();

    sfx.effects.shriek.play();
    sfx.effects.storm.setLoop(true);
    sfx.effects.storm.setVolume(0.5);
    setTimeout(() => sfx.effects.storm.play(), 3400);

    /* Switch render loops */
    cancelAnimationFrame(introRender);
    renderLoop();

    setTimeout(() => {
        const targetFOV = camera.aspect >= 1 ? landscapeFOV : portraitFOV;
        const startFOV = camera.fov;
        const startPos = Object.assign({}, camera.position);
        setTimeout(() => {
            startSpaceFlight();
            setTimeout(() => {
                setTimeout(() => sfx.effects.shriek.play(), 3500);
                animate(5000, 30, (n) => {
                    bloom.strength = lerp(1.2, 7, n);
                }).then(() => {
                    animate(500, 30, (n) => {
                        bloom.strength = 10;
                        scene.background.setRGB(n, n, n);
                    }, EasingFunctions.easeInQuad).then(() => {
                        startRain();
                    });
                });
            }, 1500);
        }, 2000);
    }, 1300);
}

function startSpaceFlight() {

    bloom.threshold = 0;
    bloom.strength = 1.2;
    bloom.radius = 0;

    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    
    camera.fov = 75;

    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();

    squares = Array(800).fill().map(getSquare);
    squares.forEach((square) => scene.add(square.mesh));

}

function startRain() {

    sceneStage = 'rain';
    squares.forEach((square) => scene.remove(square.mesh));

    animate(500, 30, (n) => {
        const rN = 1 - n;
        scene.background.setRGB(rN, rN, rN);
    }, EasingFunctions.easeInQuad).then(() => {
        drops = new DigitalRain(500);
        scene.add(drops.mesh);
        
        window.addEventListener("mousemove", (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

            drops.mesh.position.z = gsap.utils.interpolate(drops.mesh.position.z, mouseX/2, 0.1);
            drops.mesh.position.y = gsap.utils.interpolate(drops.mesh.position.y, -mouseY/2, 0.1);
        });
    });
    sfx.effects.storm.stop();

    sfx.effects.drop.setVolume(0.7);
    sfx.effects.drop.play();

    bloom.threshold = 0.22;
    bloom.strength = 1.0;

    ui.revealOverlay();
    
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    /* Reconfigure orbit controls */
    camera.fov = camera.aspect >= 1 ? landscapeFOV : portraitFOV;
    camera.position.set(0, 0, 0);
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.maxDistance = 50;
    controls.target.set(0.1, 0, 0);
    camera.updateProjectionMatrix();

    setTimeout(() => {
        sfx.effects.code.setLoop(true);
        sfx.effects.code.play();

        setTimeout(() => {
            sfx.effects.wobble.setLoop(true);
            sfx.effects.wobble.play();
        }, 8000);
    }, 1000);
}
