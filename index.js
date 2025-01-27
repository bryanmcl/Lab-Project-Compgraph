import * as THREE from './three.js/build/three.module.js'
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from './three.js/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from './three.js/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js'

let scene, camera, renderer, orbitControl, mouse;
let snows = [];
let click = false;

function loadTexture(name){
    let loader = new THREE.TextureLoader();
    let texture = loader.load(name);

    return texture
}

function init(){
    scene = new THREE.Scene();

    let fov = 45;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width/height;

    camera = new THREE.PerspectiveCamera(fov, aspect);
    camera.position.set(0,-50,70);
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setClearColor('skyblue');
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    orbitControl = new OrbitControls(camera,renderer.domElement)
    orbitControl.target = new THREE.Vector3(0,0,0)

    orbitControl.autoRotate = true;
    orbitControl.update();
    document.body.appendChild(renderer.domElement);
}

function createAmbientLight(){
    let light = new THREE.AmbientLight("#FFFFFF", 1);
    scene.add(light);
}

function createPointLight(){
    let light = new THREE.PointLight("#FFFFFF", 1);
    light.position.set(0,0,10);
    light.castShadow = true;
    scene.add(light);
}

function render(){
    renderer.render(scene,camera);
    if(click == true){
        let count  = 10;
        for (let i = 0; i < snows.length; i++) {
            if(snows[i].position.z > 0){
                snows[i].position.z -= 0.1
            }
            else {
                scene.remove(snows[i])
                snows.splice(i, 1)
                count--;
            }
            
            if(count == 0) click = false;
        }
    }
    requestAnimationFrame(render);
}

function createGround(){
    let texture = loadTexture('./assets/texture/snowtexture.png');
    let geometry = new THREE.CircleGeometry(14.5, 40);
    let material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
    })
    let ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;
    return ground;
}

function createBase(){
    let geometry = new THREE.CylinderGeometry(15,20,4,8)
    let material = new THREE.MeshBasicMaterial({
        color:"#000000"
    })
    let base = new THREE.Mesh(geometry,material);
    base.position.set(0,0,-2.1);
    base.rotation.set(1.57,0,0)
    return base;
}

function addWinterHouse(){
    let loader = new GLTFLoader();
    loader.load('./assets/model/scene.gltf', function(model){
        let house = model.scene
        house.scale.set(20,20,20)
        house.position.x = -69
        house.position.y = 50
        house.position.z = -1

        house.rotation.x = 1.5766
        house.rotation.y = 0
        house.rotation.z = 0
        console.log(model.scene)
        scene.add(model.scene);
    });
}

function addText(text){
    let loader = new FontLoader();
    loader.load('./three.js/examples/fonts/droid/droid_sans_bold.typeface.json', function(font){
        let geometry = new TextGeometry(text,{
            font: font,
            size: 2,
            height: 0.5
        });
        let material = new THREE.MeshBasicMaterial({
            color: "#FFFFFF"
        });
        let textMesh = new THREE.Mesh(geometry,material);
        textMesh.position.set(2,-19,-2.5);
        textMesh.rotation.set(1, 0.37, 0.2)
        scene.add(textMesh);
    })
}

function createGlobe(){
    let geometry = new THREE.SphereGeometry(14.5, 32,16,6.3, 6.3, 1.5, 3)
    let material = new THREE.MeshLambertMaterial({
        color:"#FFFFFF",
        transparent: true,
        opacity:0.4
    });
    let globe = new THREE.Mesh(geometry,material);
    globe.rotateX(-(Math.PI/2))
    return globe;
}

function createSnowmanBodySphere(x,y,z,size){
    let geometry = new THREE.SphereGeometry(size,32,6);
    let material = new THREE.MeshStandardMaterial({
        color:"#FFFFFF"
    })
    let lowerbody = new THREE.Mesh(geometry,material);
    lowerbody.position.set(x,y,z)
    lowerbody.castShadow = true;
    scene.add(lowerbody);
}

function createSnowmanCircle(x,y,z){
    let geometry = new THREE.SphereGeometry(0.1, 32, 6)
    let material = new THREE.MeshBasicMaterial({
        color:"#000000"
    })
    let eye = new THREE.Mesh(geometry,material);
    eye.position.set(x,y,z)
    eye.castShadow = true;
    scene.add(eye);
}

function createSnowmanNose(x,y,z){
    let geometry = new THREE.ConeGeometry(0.15,0.5,32)
    let material = new THREE.MeshBasicMaterial({
        color:"#FFA500"
    })
    let nose = new THREE.Mesh(geometry,material);
    nose.position.set(x,y,z)
    nose.rotateX(Math.PI)
    nose.castShadow = true;
    scene.add(nose);
}

function createSnowmanBody(x,y,z){
    createSnowmanBodySphere(x,y,z, 1.5);
    createSnowmanBodySphere(x,y,z+1.5, 1);
    createSnowmanBodySphere(x,y,z+2.5, 0.8);
    createSnowmanCircle(x+0.3,y-0.6,z+3);
    createSnowmanCircle(x-0.3,y-0.6,z+3);
    createSnowmanNose(x,y-1,z+2.5)
    createSnowmanCircle(x,y-1,z+2);
    createSnowmanCircle(x,y-1,z+1.6);
    createSnowmanCircle(x,y-1,z+1.0);
}

function createSnowman(){
    createSnowmanBody(8,-6,1.5);
}

function createTreeTrunk(x,y,z){
    let geometry = new THREE.BoxGeometry(0.5,7,0.5);
    let material = new THREE.MeshPhongMaterial({
        shine:100,
        color:"#3F301D"
    })
    let treeTrunk = new THREE.Mesh(geometry,material);
    treeTrunk.position.set(x,y,z)
    treeTrunk.rotateX(Math.PI/2)
    treeTrunk.castShadow = true;
    scene.add(treeTrunk)
}

function createTreeLeaf(x,y,z){
    let geometry = new THREE.ConeGeometry(1.5,5,32);
    let material = new THREE.MeshBasicMaterial({
        shine:100,
        color:"#32612D"
    })
    let treeLeaf = new THREE.Mesh(geometry,material);
    treeLeaf.position.set(x,y,z+4.5)
    treeLeaf.rotateX(Math.PI/2)
    treeLeaf.castShadow = true;
    scene.add(treeLeaf)
}

function createTree(x,y,z){
    createTreeTrunk(x,y,z);
    createTreeLeaf(x,y,z);
}

function createSnow(x, y, z){
    let geometry = new THREE.SphereGeometry(0.1, 12, 6)
    let material = new THREE.MeshBasicMaterial({
        color:"#FFFFFF"
    })
    let snow = new THREE.Mesh(geometry,material);
    snow.position.set(x,y,z)
    snow.castShadow = true
    return snow
}

function addSnow(){
    if(snows.length > 0){
        snows.forEach(snow => {
            scene.remove(snow)
        });
    }
    snows = [
    createSnow(2, 0, 9),
    createSnow(0, 8, 10),
    createSnow(0, 0, 9),
    createSnow(-7, 4, 9),
    createSnow(5, -4, 10),
    createSnow(2, -8, 11),
    createSnow(0, -8, 8),
    createSnow(-2, 2, 10),
    createSnow(6, -2, 11),
    createSnow(8, 5, 8)
    ]

    snows.forEach(snow => {
        scene.add(snow)
    });
}

function createSkybox(){
    let geometry = new THREE.BoxGeometry(300, 300, 300)
    let material = [
        new THREE.MeshBasicMaterial({
            map: loadTexture('./assets/skybox/px.jpg'), side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: loadTexture('./assets/skybox/nx.jpg'), side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: loadTexture('./assets/skybox/py(2).jpg'), side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: loadTexture('./assets/skybox/ny.jpg'), side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: loadTexture('./assets/skybox/pz.jpg'), side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: loadTexture('./assets/skybox/nz.jpg'), side: THREE.BackSide
        })
    ]

    let skybox = new THREE.Mesh(geometry, material)
    scene.add(skybox)
}

window.onload = () => {
    init();
    addEventListener();
    createAmbientLight();
    createPointLight();

    let ground = createGround();
    scene.add(ground);

    let base = createBase();
    scene.add(base)

    let globe = createGlobe();
    scene.add(globe);

    addWinterHouse();
    addText("Snowball");

    createSnowman();

    createTree(-10,0,0);
    createTree(-8,4,0);

    createSkybox();

    render();
}

function onMouseClick(){
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if(intersects.length > 1){
        addSnow()
        console.log(intersects)
        click = true;
    }
    
}

function addEventListener(){
    document.addEventListener("click",  onMouseClick)
}

window.onresize = () =>{
    let w = innerWidth;
    let h = innerHeight;
    let aspect = w/h;
    renderer.setSize(w,h)
    camera.aspect = aspect
    camera.updateProjectMatrix() //kalo ada perubahan camera
}

window.onmousemove = function (e) {
    mouse = new THREE.Vector2()

    mouse.x = (e.clientX / window.innerWidth)*2 - 1
    mouse.y = -((e.clientY / window.innerHeight)*2 - 1)
}