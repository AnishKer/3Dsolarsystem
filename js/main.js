import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Global variable to control animation state
//Declaring variables
let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;

//Distance from the sun
let mercuryOrbitDistance = 50
let venusOrbitDistance = 60
let earthOrbitDistance = 70
let marsOrbitDistance = 80
let jupiterOrbitDistance = 100
let saturnOrbitDistance = 120
let uranusOrbitDistance = 140
let neptuneOrbitDistance = 160

//Revolution speed
let mercury_revolution_speed= 0.948;
let venus_revolution_speed= 0.7;
let earth_revolution_speed= 0.596;
let mars_revolution_speed= 0.482;
let jupiter_revolution_speed= 0.262;
let saturn_revolution_speed= 0.194;
let uranus_revolution_speed= 0.136;
let neptune_revolution_speed= 0.108;

let isAnimating = true; // By default, animation is playing

//Enclosing the project in a cube
function createMaterialArray() {
  const skyboxImagepaths = ['../img/skybox/space_ft.png', '../img/skybox/space_bk.png', '../img/skybox/space_up.png', '../img/skybox/space_dn.png', '../img/skybox/space_rt.png', '../img/skybox/space_lf.png']
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

//Working with the cube
function setSkyBox() {
  const materialArray = createMaterialArray();
  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

//Loading the planets
function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);

  return planet
}

//Loading the rings
function createRing(innerRadius) {
  let outerRadius = innerRadius - 0.1
  let thetaSegments = 100
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
  mesh.rotation.x = Math.PI / 2;
  return mesh;

}


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(85,window.innerWidth / window.innerHeight,0.1,1000);

  setSkyBox();
  planet_sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, 'basic');
  planet_mercury = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100, 'standard');
  planet_venus = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100, 'standard');
  planet_earth = loadPlanetTexture("../img/earth_hd.jpg", 4, 100, 100, 'standard');
  planet_mars = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100, 'standard');
  planet_jupiter = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100, 'standard');
  planet_saturn = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100, 'standard');
  planet_uranus = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100, 'standard');
  planet_neptune = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100, 'standard');

  scene.add(planet_sun);
  scene.add(planet_mercury);
  scene.add(planet_venus);
  scene.add(planet_earth);
  scene.add(planet_mars);
  scene.add(planet_jupiter);
  scene.add(planet_saturn);
  scene.add(planet_uranus);
  scene.add(planet_neptune);

  const sunLight = new THREE.PointLight(0xffffff, 1, 0);
  sunLight.position.copy(planet_sun.position);
  scene.add(sunLight);

  createRing(mercuryOrbitDistance)
  createRing(venusOrbitDistance)
  createRing(earthOrbitDistance)
  createRing(marsOrbitDistance)
  createRing(jupiterOrbitDistance)
  createRing(saturnOrbitDistance)
  createRing(uranusOrbitDistance)
  createRing(neptuneOrbitDistance)




  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  camera.position.z = 100;
}

//Revolving path,speed and angle
function planetRevolver(time, speed, planet, orbitRadius) {

  let orbitSpeedMultiplier = 0.001;
  const planetAngle = time * orbitSpeedMultiplier * speed;
  planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetAngle);
  planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetAngle);
}


// animating planets - rotating, using revolver function
function animate(time) {
  requestAnimationFrame(animate);

  if (isAnimating) {
    const rotationSpeed = 0.006;
    planet_sun.rotation.y += rotationSpeed;
    planet_mercury.rotation.y += rotationSpeed;
    planet_venus.rotation.y += rotationSpeed;
    planet_earth.rotation.y += rotationSpeed;
    planet_mars.rotation.y += rotationSpeed;
    planet_jupiter.rotation.y += rotationSpeed;
    planet_saturn.rotation.y += rotationSpeed;
    planet_uranus.rotation.y += rotationSpeed;
    planet_neptune.rotation.y += rotationSpeed;


    planetRevolver(time, mercury_revolution_speed, planet_mercury, mercuryOrbitDistance, 'mercury')
    planetRevolver(time, venus_revolution_speed, planet_venus, venusOrbitDistance, 'venus')
    planetRevolver(time, earth_revolution_speed, planet_earth, earthOrbitDistance, 'earth')
    planetRevolver(time, mars_revolution_speed, planet_mars, marsOrbitDistance, 'mars')
    planetRevolver(time, jupiter_revolution_speed, planet_jupiter, jupiterOrbitDistance, 'jupiter')
    planetRevolver(time, saturn_revolution_speed, planet_saturn, saturnOrbitDistance, 'saturn')
    planetRevolver(time, uranus_revolution_speed, planet_uranus, uranusOrbitDistance, 'uranus')
    planetRevolver(time, neptune_revolution_speed, planet_neptune, neptuneOrbitDistance, 'neptune')

  }
    updatePlanetLabels();
    renderer.render(scene, camera);
  }



//fixing issue where the page is not covered if resizing from small screen to big
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to toggle animation
function toggleAnimation() {
  isAnimating = !isAnimating;
  const button = document.getElementById('toggleAnimationButton');
  if (isAnimating) {
    button.textContent = 'Pause';
  } else {
    button.textContent = 'Start';
  }
}

// Creating a button for toggling animation
function createToggleButton() {
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'toggleButtonContainer';
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '20px';
  buttonContainer.style.right = '20px';
  buttonContainer.style.backgroundColor = 'rgba(255, 8, 0, 0.5)';
  buttonContainer.style.padding = '15px';
  buttonContainer.style.borderRadius = '10px';
  buttonContainer.style.zIndex = '1000'; // Ensure it's above the canvas

  const button = document.createElement('button');
  button.id = 'toggleAnimationButton';
  button.textContent = 'Pause'; // Initial text
  button.addEventListener('click', toggleAnimation);
  buttonContainer.appendChild(button);
  document.body.appendChild(buttonContainer);
}
function createPlanetLabel(name, planet) {
  const loader = new THREE.FontLoader();
  loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(name, {
      font: font,
      size: 3,
      height: 0.1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position the label above the planet
    textMesh.position.set(planet.position.x, planet.position.y + planet.geometry.parameters.radius + 2, planet.position.z);
    textMesh.lookAt(camera.position); // Make the label always face the camera
    scene.add(textMesh);

    // Store the label with the planet for easy updating
    planet.label = textMesh;
  });
}

// Update label positions in the animate function
function updatePlanetLabels() {
  if (planet_mercury.label) {
    planet_mercury.label.position.set(planet_mercury.position.x, planet_mercury.position.y + planet_mercury.geometry.parameters.radius + 2, planet_mercury.position.z);
    planet_mercury.label.lookAt(camera.position);
  }
  if (planet_venus.label) {
    planet_venus.label.position.set(planet_venus.position.x, planet_venus.position.y + planet_venus.geometry.parameters.radius + 2, planet_venus.position.z);
    planet_venus.label.lookAt(camera.position);
  }
  if (planet_earth.label) {
    planet_earth.label.position.set(planet_earth.position.x, planet_earth.position.y + planet_earth.geometry.parameters.radius + 2, planet_earth.position.z);
    planet_earth.label.lookAt(camera.position);
  }
  if (planet_mars.label) {
    planet_mars.label.position.set(planet_mars.position.x, planet_mars.position.y + planet_mars.geometry.parameters.radius + 2, planet_mars.position.z);
    planet_mars.label.lookAt(camera.position);
  }
  if (planet_jupiter.label) {
    planet_jupiter.label.position.set(planet_jupiter.position.x, planet_jupiter.position.y + planet_jupiter.geometry.parameters.radius + 2, planet_jupiter.position.z);
    planet_jupiter.label.lookAt(camera.position);
  }
  if (planet_saturn.label) {
    planet_saturn.label.position.set(planet_saturn.position.x, planet_saturn.position.y + planet_saturn.geometry.parameters.radius + 2, planet_saturn.position.z);
    planet_saturn.label.lookAt(camera.position);
  }
  if (planet_uranus.label) {
    planet_uranus.label.position.set(planet_uranus.position.x, planet_uranus.position.y + planet_uranus.geometry.parameters.radius + 2, planet_uranus.position.z);
    planet_uranus.label.lookAt(camera.position);
  }
  if (planet_neptune.label) {
    planet_neptune.label.position.set(planet_neptune.position.x, planet_neptune.position.y + planet_neptune.geometry.parameters.radius + 2, planet_neptune.position.z);
    planet_neptune.label.lookAt(camera.position);
  }
  if (planet_sun.label) {
    planet_sun.label.position.set(planet_sun.position.x, planet_sun.position.y + planet_sun.geometry.parameters.radius + 2, planet_sun.position.z);
    planet_sun.label.lookAt(camera.position);
  }
}

//creating labels
function createAllPlanetLabels() {
  createPlanetLabel("Mercury", planet_mercury);
  createPlanetLabel("Venus", planet_venus);
  createPlanetLabel("Earth", planet_earth);
  createPlanetLabel("Mars", planet_mars);
  createPlanetLabel("Jupiter", planet_jupiter);
  createPlanetLabel("Saturn", planet_saturn);
  createPlanetLabel("Uranus", planet_uranus);
  createPlanetLabel("Neptune", planet_neptune);
  createPlanetLabel("Sun", planet_sun);

  // Add Saturn's rings
  const baseRingRadius = planet_saturn.geometry.parameters.radius + 4;
  for (let i = 0; i < 15; i++) {
    const ring = createRing(baseRingRadius + i * 0.2);
    ring.rotation.x = Math.PI / 2;
    planet_saturn.add(ring);
  }

}



window.addEventListener("resize", onWindowResize, false);
createToggleButton();
init();
animate(0);

createAllPlanetLabels();