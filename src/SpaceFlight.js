import * as THREE from '../vendor/three/build/three.module.js';

const squareGeo = new THREE.PlaneGeometry(1, 1);
//const colors = [0xfe3508, 0x882121, 0x92505c, 0x300e22, 0x4f0505];
const colors = [0x47fe08, 0x328821, 0x599250, 0x0e3010, 0x1e4f05, 0xfeb308, 0x08fafe, 0xffffff];

export function getSquare() {
    const x = Math.round(Math.random() * 30) - 15.5;
    const y = Math.round(Math.random()) * 4;
    const z = Math.round(Math.random() * -80) - 0.5;

    const basicMat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide

    });
    const mesh = new THREE.Mesh(squareGeo, basicMat);
    mesh.position.set(x, y, z);
    mesh.rotation.x = -90 * Math.PI / 180;
    const limit = 81;
    let speed = 0.1;

    return {
        mesh,
        update() {
            speed += 0.005;
            mesh.position.z += speed;
            if (mesh.position.z > 4) {
                mesh.position.z = -limit;
            }
        }
    }
}