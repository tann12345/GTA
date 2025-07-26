// script.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, car, keys = {};
let speed = 0, maxSpeed = 0.5, acceleration = 0.01, turnSpeed = 0.03;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('.game-area').appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lighting
  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 10, 7.5);
  scene.add(directional);

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(500, 500);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Simple car
  const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
  car = new THREE.Mesh(carGeometry, carMaterial);
  car.position.y = 0.25;
  scene.add(car);

  // Buildings
  for (let i = 0; i < 20; i++) {
    const buildingGeometry = new THREE.BoxGeometry(2, Math.random() * 10 + 5, 2);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x0ff });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(
      (Math.random() - 0.5) * 200,
      building.geometry.parameters.height / 2,
      (Math.random() - 0.5) * 200
    );
    scene.add(building);
  }

  // Handle input
  document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Car control
  if (keys['w']) speed = Math.min(speed + acceleration, maxSpeed);
  else if (keys['s']) speed = Math.max(speed - acceleration, -maxSpeed / 2);
  else speed *= 0.95; // Friction

  if (keys['a']) car.rotation.y += turnSpeed;
  if (keys['d']) car.rotation.y -= turnSpeed;

  car.translateZ(speed);

  camera.position.x = car.position.x + Math.sin(-car.rotation.y) * 10;
  camera.position.z = car.position.z + Math.cos(-car.rotation.y) * 10;
  camera.lookAt(car.position);

  renderer.render(scene, camera);
}

init();
