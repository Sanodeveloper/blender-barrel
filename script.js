import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';

window.addEventListener("DOMContentLoaded", init);

function init() {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#myCanvas")
    });

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

  // カメラを作成
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
    camera.position.set(5, 5, 0);

    // 平行光源
    const light = new THREE.DirectionalLight(0xFFFFFF, 5);
    light.position.set(1,3, -4); // ライトの方向
    light.castShadow = true
    light.shadow.mapSize.set(1024, 1024);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    const sky = new Sky();
    sky.scale.setScalar(45000);
    sky.material.uniforms.turbidity.value=0.8;// 大気の透明度
    sky.material.uniforms.rayleigh.value=0.3;// 入射する光子の数
    sky.material.uniforms.mieCoefficient.value=0.005;// 太陽光の散乱度 三重係数
    sky.material.uniforms.mieDirectionalG.value=0.8; // 太陽光の散乱度 三重指向性G
    sky.material.uniforms.sunPosition.value.x= 10000;//太陽の位置
    sky.material.uniforms.sunPosition.value.y= 30000;//太陽の位置
    sky.material.uniforms.sunPosition.value.z=-40000;//太陽の位置
    scene.add(sky);


    const loader = new GLTFLoader();
    loader.load('barel.glb', function (gltf) {
        const model = gltf.scene;
        model.traverse((obj) => {
            console.log(obj);
            obj.castShadow = true;
            obj.receiveShadow = true;
            if(obj.name === '平面') {
                obj.castShadow = false;
            }
        });
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);
    });

    // 初回実行
    tick();

    function tick() {
        requestAnimationFrame(tick);
        renderer.render(scene, camera);
    }
}