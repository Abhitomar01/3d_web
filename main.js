import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import gsap from 'gsap';
//import LocomotiveScroll from 'locomotive-scroll';


//const locomotiveScroll = new LocomotiveScroll();

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

// Load HDRI
const loader = new RGBELoader();
loader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});
 let model;
// Load GLTF Model
const gltfLoader = new GLTFLoader();
gltfLoader.load('DamagedHelmet.gltf', (gltf) => {
  model = gltf.scene;
  scene.add(model);
}, undefined, (error) => {
  console.error(error);
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
  alpha:true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(window.innerWidth, window.innerHeight);

// Postprocessing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms.amount.value = 0.001;
composer.addPass(renderPass);
composer.addPass(rgbShiftPass);

window.addEventListener("mousemove",(e) =>{
if (model){
  const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * .3);
  const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * .3);
  gsap.to(model.rotation, { 
  x: rotationY, 
  y: rotationX, 
  duration: 0.5, 
  ease: 'power2.out' 
});
}
})
window.addEventListener("resize" ,()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth ,window.innerHeight);
  composer.setSize(window.innerWidth , window.innerHeight);
})
// Animation loop
function animate() {
  requestAnimationFrame(animate);

 // controls.update(); // Required if damping is enabled
  composer.render();
}

animate();