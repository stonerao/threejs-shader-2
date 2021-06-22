import * as THREE from 'three'

/* 
 * https: //threejs.org/docs/index.html?q=Point#api/zh/materials/PointsMaterial
 */
const radom = () => {
    return parseInt(Math.random() * 255)
}

export default function (scene) {
    const positions = [];
    const attrPositions = [];
    const attrCindex = [];

    // 粒子位置计算
    const source = -500;
    const target = 500;
    const number = 100;
    const total = target - source;

    for (let i = 0; i < number; i++) {
        const index = i / (number - 1);
        const x = total * index - total / 2;

        positions.push({
            x: x,
            y: 0,
            z: 0
        });
        attrCindex.push(index);
    }

    positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
    })

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));
    // 传递当前所在位置
    geometry.setAttribute('cindex', new THREE.Float32BufferAttribute(attrCindex, 1));

    const shader = new THREE.ShaderMaterial({
        uniforms: {
            uColor: {
                value: new THREE.Color('#FF0000')
            },
            uColor1: {
                value: new THREE.Color('#FFFFFF')
            },
            uSzie: {
                value: 20
            }
        },
        vertexShader: `
        attribute float cindex;
        uniform float uSzie;
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying vec3 vColor;
        void main() {
            // 顶点着色器计算后的Position
            vColor = mix(uColor, uColor1, cindex);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = uSzie * 300.0 / (-mvPosition.z);
        }`,
        fragmentShader: `
        varying vec3 vColor; 
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }`
    });

    const point = new THREE.Points(geometry, shader);

    scene.add(point);

}
