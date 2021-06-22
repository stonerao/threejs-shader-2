import * as THREE from 'three'

/* 
 * https: //threejs.org/docs/index.html?q=Point#api/zh/materials/PointsMaterial
 */
const radom = () => {
    return parseInt(Math.random() * 255)
}
export default function (scene) {
    const positions = [{
        x: 0,
        y: 0,
        z: 0
    }];

    const attrPositions = [];

    positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
    })

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3)); 

    const shader = new THREE.ShaderMaterial({
        uniforms: {
            uColor: {
                value: new THREE.Color('#FFFF00')
            },
            uSzie: {
                value: 20
            }
        },
        vertexShader: `
        uniform float uSzie;
        void main() {
            // 顶点着色器计算后的Position
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = uSzie * 300.0 / (-mvPosition.z);
        }`,
        fragmentShader: `
        uniform vec3 uColor;
        void main() {
            gl_FragColor = vec4(uColor, 1.0);
        }`
    });

    const point = new THREE.Points(geometry, shader);

    scene.add(point);

    setInterval(() => {
        const color = `rgb(${radom()}, ${radom()}, ${radom()})`;
        shader.uniforms.uColor.value.setStyle(color); 
    }, 50)

}
