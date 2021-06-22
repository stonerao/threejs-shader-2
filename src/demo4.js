import * as THREE from 'three'
 
export default function (scene) {
    const positions = [];
    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    // 粒子位置计算
    const source = -500;
    const target = 500;
    const number = 1000;
    const height = 300;
    const total = target - source;

    for (let i = 0; i < number; i++) {
        const index = i / (number - 1);
        const x = total * index - total / 2;
        const y = Math.sin(index * Math.PI) * height;
        positions.push({
            x: x,
            y: y,
            z: 0
        });
        attrCindex.push(index);
        attrCnumber.push(i);
    }

    positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
    })

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));
    // 传递当前所在位置
    geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1));
    geometry.setAttribute('current', new THREE.Float32BufferAttribute(attrCnumber, 1));

    const shader = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uColor: {
                value: new THREE.Color('#FF0000') // 颜色
            },
            uColor1: {
                value: new THREE.Color('#FFFFFF')
            },
            uRange: {
                value: 100 // 显示当前范围的个数
            },
            uSize: {
                value: 20// 粒子大小
            },
            uTotal: {
                value: number // 当前粒子的所有的总数
            },
            time: {
                value: 0 // 
            }
        },
        vertexShader: `
        attribute float index;
        attribute float current;
        uniform float time;
        uniform float uSize;
        uniform float uRange; // 展示区间
        uniform float uTotal; // 粒子总数
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            // 需要当前显示的索引
            float size = uSize;
            float showNumber = uTotal * mod(time, 1.0);
            if (showNumber > current && showNumber < current + uRange) {
                float uIndex = ((current + uRange) - showNumber) / uRange;
                size *= uIndex;
                vOpacity = 1.0;
            } else {
                vOpacity = 0.0;
            }

            // 顶点着色器计算后的Position
            vColor = mix(uColor, uColor1, index);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
        }`,
        fragmentShader: `
        varying vec3 vColor; 
        varying float vOpacity;
        void main() {
            gl_FragColor = vec4(vColor, vOpacity);
        }`
    });

    const point = new THREE.Points(geometry, shader);

    scene.add(point);

    setInterval(() => {
        shader.uniforms.time.value += 0.001;
    })
}
