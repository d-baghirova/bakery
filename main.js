import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('cvs')});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const pointLight = new THREE.PointLight(0xffffff, 1000, 500);
pointLight.position.set(0,20, 10);
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);
 
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 20;
camera.position.y = 12;
camera.position.x = 0;

//delete it 
camera.rotation.y = 0;

const loader = new GLTFLoader();
let moveLeft;
let moveRight;

let isMoveLeft = true;
let rotateRight = true;
let modelsSwitchInterval = 500; 

function snowFlake() {
	const g = new THREE.SphereGeometry(0.25, 24, 24);
	const m = new THREE.MeshBasicMaterial({color: 0xffffff});
	const s = new THREE.Mesh(g, m);
	
	const [x, y, z] = Array(3)
	  .fill()
	  .map(() => THREE.MathUtils.randFloatSpread(100));

	s.position.set(x, y, z);
	// scene.add(s);
	return s;
}

function snowFlakes(){
	// Array(200).fill().forEach(addSnowFlake);
	let sfs = [];
	for (let i=0; i<200; i++){
		const m = snowFlake();
		sfs.push(m);
	}
	return sfs;
}

let snowFlakesArr = snowFlakes();
console.log(snowFlakesArr);

function addSnowFlakes() {
	if (snowFlakesArr){
		snowFlakesArr.forEach(s => scene.add(s));
	}
}

function snowFall() {
	addSnowFlakes();
	if (snowFlakesArr.length > 0){
		snowFlakesArr.forEach(s => {
			if (s.position.y >= -20){
				s.position.y -= 0.1;
			} if (s.position.y < -20){
				s.position.y = 20;
			}
		});
	}
}



function toggleModels() {
    if (isMoveLeft) {
        scene.remove(moveRight);
        scene.add(moveLeft);
    } else {
        scene.remove(moveLeft);
        scene.add(moveRight);
    }
    isMoveLeft = !isMoveLeft;
	
    setTimeout(toggleModels, modelsSwitchInterval);
}

function rotating(mesh) {
	if (mesh.rotation.y <= 0.5 && mesh.rotation.y >= -0.5 && rotateRight){
		mesh.rotation.y += 0.01;
	} else if (mesh.rotation.y > 0.5){
		rotateRight = false;
		mesh.rotation.y -= 0.01;
	} else if (mesh.rotation.y <= 0.5 && mesh.rotation.y >= -0.5 && !rotateRight) {
		mesh.rotation.y -= 0.01;
	} else if (mesh.rotation.y < -0.5){
		rotateRight = true;
		mesh.rotation.y += 0.01;
	} 
}


// new year (group)

const group = new THREE.Group();


const phiStart = 0;
const phiEnd = Math.PI * 2;
const thetaStart = 0;
const thetaEnd = Math.PI / 2/4;

const geometry = new THREE.BoxGeometry(100, 1, 50);
const snowTexture = new THREE.TextureLoader().load('./snow.jpg');
const texture = new THREE.MeshStandardMaterial({map: snowTexture});
const ground = new THREE.Mesh(geometry, texture);
ground.position.y = -1;
ground.position.x = 0;
ground.position.z = -1;
group.add(ground);

const geometry2 = new THREE.SphereGeometry(20,1000, 200, phiStart, phiEnd, thetaStart/2, thetaEnd * 4);
const ground2 = new THREE.Mesh(geometry2, texture);
ground2.position.y = -8;
ground2.position.z = -15;
ground2.position.x = 15;
group.add(ground2);

const geometry3 = new THREE.SphereGeometry(20,1000, 200, phiStart, phiEnd, thetaStart/2, thetaEnd * 4);
const ground3 = new THREE.Mesh(geometry2, texture);
ground3.position.y = -14;
ground3.position.z = -25;
ground3.position.x = -20;
group.add(ground3);

const cone = new THREE.ConeGeometry(3, 10, 20);
const waffleTexture = new THREE.TextureLoader().load('/waffles.jpg');
const waffleCone = new THREE.Mesh(cone, new THREE.MeshStandardMaterial({map: waffleTexture}));

waffleCone.position.x = -15;
waffleCone.position.y = 3;
group.add(waffleCone);

const smallCone = new THREE.ConeGeometry(3, 10, 10);
const smallWaffleTexture = new THREE.TextureLoader().load('/waffles.jpg');
const smallWaffleCone = new THREE.Mesh(cone, new THREE.MeshStandardMaterial({map: waffleTexture}));

smallWaffleCone.position.x = -20;

group.add(smallWaffleCone);

let gh;

loader.load('./gh3.glb', function(gltf) {
	gh = gltf.scene.clone();
	gh.scale.set(30, 30, 30);
	gh.position.y = 10;
	gh.position.x = 10;
	gh.position.z = -15;
	gh.rotation.z = 0.3;
	group.add(gh);
}, undefined, function(error) {
	console.error(error);
})

let cc;

loader.load('./cc.glb', function(gltf) {
	const cc = gltf.scene.clone();
	cc.scale.set(0.05, 0.05, 0.05);
	cc.position.y = 3;
	cc.position.x = -10;
	cc.position.z = -20;
	group.add(cc);
}, undefined, function(error) {
	console.error(error);
})

let ccb;

loader.load('./ccb.glb', function(gltf) {
	const ccb = gltf.scene.clone();
	ccb.scale.set(0.01, 0.01, 0.01);
	ccb.position.y = 1;
	ccb.position.x = -16;
	ccb.position.z = -15;
	ccb.rotation.y = -2;
	group.add(ccb);
}, undefined, function(error) {
	console.error(error);
})

let ccg;

loader.load('./ccg.glb', function(gltf) {
	const ccg = gltf.scene.clone();
	ccg.scale.set(0.01, 0.01, 0.01);
	ccg.position.y = 2;
	ccg.position.x = -20;
	ccg.position.z = -17;
	group.add(ccg);
}, undefined, function(error) {
	console.error(error);
})

let gh2;

loader.load('./gh3.glb', function(gltf) {
	gh2 = gltf.scene.clone();
	gh2.scale.set(30, 30, 30);
	gh2.position.y = 10;
	gh2.position.x = 20;
	gh2.position.z = -15;
	gh2.rotation.z = -0.3;
	group.add(gh2);
}, undefined, function(error) {
	console.error(error);
})

let gh3;

loader.load('./gh3.glb', function(gltf) {
	gh3 = gltf.scene.clone();
	gh3.scale.set(30, 30, 30);
	gh3.position.y = 1;
	gh3.position.x = -10;
	gh3.position.z = -10;
	gh3.rotation.z = -0.3;
	group.add(gh3);
}, undefined, function(error) {
	console.error(error);
})

loader.load('./gman.glb', function(gltf) {
    moveLeft = gltf.scene.clone();
    moveLeft.scale.set(-0.03, 0.03, 0.03);
    moveRight = gltf.scene.clone();
    moveRight.scale.set(0.03, 0.03, 0.03);
	moveLeft.position.y = -1;
	moveRight.position.y = -1;
	moveLeft.position.x = -2;
	moveRight.position.x = -2;
	scene.add(moveLeft);
	
	setTimeout(toggleModels, modelsSwitchInterval);
}, undefined, function (error) {
    console.error(error);
});

// const bgTexture = new THREE.TextureLoader().load('bg.jpg');
scene.background = new THREE.Color( '#c2c1f6' );



// group.rotation.y = 0;

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	if (window.scrollY > window.innerHeight){
	camera.rotation.y = t * -0.005;}
  }
  
  document.body.onscroll = moveCamera;
  moveCamera();

// bakery

const bakery = new THREE.Group();

const geometry1 = new THREE.BoxGeometry(100, 1, 50);
const woodTexture = new THREE.TextureLoader().load('./wood.jpg');
const texture1 = new THREE.MeshStandardMaterial({map: woodTexture});
const ground4 = new THREE.Mesh(geometry1, texture1);
ground4.position.y = -1;
ground4.position.x = 0;
ground4.position.z = -1;
bakery.add(ground4);

let plate;

loader.load('./plate.glb', function(gltf){
	plate = gltf.scene.clone();
	plate.scale.set(50,50,50)
	plate.rotation.z = 0.1;
	plate.position.z = -5;
	bakery.add(plate)
}, undefined, function(error) {
	console.error(error);
});

let cupcakes;

loader.load('./cupcakes.glb', function(gltf){
	cupcakes = gltf.scene.clone();
	cupcakes.scale.set(0.015, 0.015, 0.015);
	cupcakes.position.x = 20;
	cupcakes.position.z = -10;
	cupcakes.rotation.y = 2;
	bakery.add(cupcakes);
}, undefined, function(error) {
	console.error(error)
})

let maccaroon;

loader.load('./maccaroon.glb', function(gltf) {
	maccaroon = gltf.scene.clone();
	maccaroon.scale.set(2,2,2);
	maccaroon.position.y = -14;
	maccaroon.position.x = 6;
	maccaroon.rotation.y = -1;
	bakery.add(maccaroon);
}, undefined, function(error) {
	console.error(error);
})

let waffle;

loader.load('./waffle1.glb', function(gltf) {
	waffle = gltf.scene.clone();
	waffle.scale.set(3.5,3.5,3.5);
	waffle.position.x = -2;
	waffle.position.z = -3;
	waffle.position.y = 0.1;
	bakery.add(waffle);
}, undefined, function(error) {
	console.error(error);
})

let cake;

loader.load('./cake.glb', function(gltf) {
	cake = gltf.scene.clone();
	cake.scale.set(0.3,0.3,0.3);
	cake.position.x = -18;
	cake.position.z = -10;
	bakery.add(cake);
}, undefined, function(error) {
	console.error(error)
})

// national

const national = new THREE.Group();

// const geometry1 = new THREE.BoxGeometry(100, 1, 50);
// const woodTexture = new THREE.TextureLoader().load('./wood.jpg');
// const texture1 = new THREE.MeshStandardMaterial({map: woodTexture});
const ground1 = new THREE.Mesh(geometry1, texture1);
ground1.position.y = -1;
ground1.position.x = 0;
ground1.position.z = 49;
national.add(ground1);

let cp;

loader.load('./carpet.glb', function(gltf) {
    cp = gltf.scene.clone();
    cp.scale.set(20,20,20);
	cp.position.y = 0.2;
	cp.position.x = -2;
	cp.position.z = 50;
	national.add(cp);
}, undefined, function (error) {
    console.error(error);
});

let shekerbura;
loader.load('./shekerbura.glb', function(gltf){
	shekerbura = gltf.scene.clone();

	shekerbura.scale.set(10,10,10);
	shekerbura.position.z = 40;
	shekerbura.position.y = -2.5;

	national.add(shekerbura);
}, undefined, function(error){
	console.error(error);
});

let shekerbura1;
loader.load('./shekerbura.glb', function(gltf){
	shekerbura1 = gltf.scene.clone();

	shekerbura1.scale.set(10,10,10);
	shekerbura1.position.z = 37;
	shekerbura1.position.x = 15;
	shekerbura1.position.y = -2.5;

	national.add(shekerbura1);
}, undefined, function(error){
	console.error(error);
});

let tray;

loader.load('./tray.glb', function(gltf){
	tray = gltf.scene.clone();

	tray.scale.set(35,35,35);

	tray.position.z = 37;
	tray.position.x = -19;
	tray.position.y = 0.1;

	national.add(tray);
}, undefined, function(error){
	console.error(error);
});

let tray1;

loader.load('./tray.glb', function(gltf){
	tray1 = gltf.scene.clone();

	tray1.scale.set(30,30,30);

	tray1.rotation.y = 1;
	tray1.position.z = 50;
	tray1.position.x = 15;

	national.add(tray1);
}, undefined, function(error){
	console.error(error);
});

let teapot;

loader.load('./teapot.glb', function(gltf){
	teapot = gltf.scene.clone();

	teapot.position.z = 50;
	teapot.position.x = -10;
	teapot.position.y = 5;

	national.add(teapot);
}, undefined, function(error){
	console.error(error);
});

const pahlavaTexture = new THREE.TextureLoader().load('./pahlava.png');
const pahlava = new THREE.Mesh(new THREE.BoxGeometry(16,1,10), new THREE.MeshStandardMaterial({map: pahlavaTexture}));

pahlava.position.z = 37;
pahlava.position.x = -19;
pahlava.position.y = 1;
national.add(pahlava);

function removeCookie() {
	if (moveLeft !== undefined ) {
		scene.remove(moveLeft);
	} if (moveRight !== undefined) {
		scene.remove(moveRight);
	} 
}







const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el)
    }
  })
}

window.addEventListener("scroll", () => { 
  handleScrollAnimation();
});
















function animate() {
    requestAnimationFrame(animate);
    
	// meshGroup.rotation.x += 0.1;

	// if (gh2 !== undefined) {
	// 	scene.remove(gh2);
	// }

	const title = document.querySelector('header');

	scene.add(national);
	scene.add(bakery);

	if (camera.rotation.y < 2){
		snowFlakesArr.forEach(s => scene.remove(s));
		title.innerHTML = `<h1 style=color:#FA3E4B>Just pastries</h1>`
		scene.background = new THREE.Color('#FCD9DA')
		scene.remove(group);
		removeCookie();
	} else if (camera.rotation.y >= 2 && camera.rotation.y <4) {
		title.innerHTML = `<h1  style=color:#F19C47>Local pastries</h1>`
		scene.background = new THREE.Color('#FDE3C8')
		snowFlakesArr.forEach(s => scene.remove(s));
		removeCookie();
	}  else if (camera.rotation.y >=4 && camera.rotation.y <7){
		title.innerHTML = `<h1>New Year's pastries</h1>`
		scene.background = new THREE.Color('#c2c1f6')
		scene.remove(bakery);
		scene.add(group);
		snowFall();
	} else {
		scene.background = new THREE.Color('#FDE3C8')
		title.innerHTML = `<h1></h1>`
		title.style.height = '3rem';
		snowFlakesArr.forEach(s => scene.remove(s));
		scene.remove(bakery);
		scene.remove(national);
		scene.remove(group);
		console.log(camera.rotation.y);
		removeCookie();
	}
	if (moveLeft){
	rotating(moveLeft);}
	if (moveRight){
	rotating(moveRight);}

    renderer.render(scene, camera);
}
 

// newYearArr.forEach(item => {
// 	scene.traverse(function(object) {
// 		if (object.isMesh && object.name === item){
// 			scene.remove(object);
// 		}
// 	});
// })


animate();