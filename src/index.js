// https://www.codeandweb.com/free-sprite-sheet-packer
import './styles.css'
import * as THREE from 'three'
import init from './init'

// NOT INTERESTING
const cameraPosition = 40
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
const camera = new THREE.PerspectiveCamera(
    25, // fov
    window.innerWidth / window.innerHeight, // aspect
    1, // near
    999999 // far
)
camera.position.set(cameraPosition, cameraPosition, cameraPosition)
camera.lookAt(new THREE.Vector3(0, 0, 0))
renderer.setSize(window.innerWidth, window.innerHeight)

// geometry
scene.add(new THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))

// lights
const dirLight = new THREE.DirectionalLight()
dirLight.position.set(1, 0.4, 0.2)
scene.add(dirLight, new THREE.AmbientLight(0x444444))

document.body.appendChild(renderer.domElement)

let spriteAnimated
init(s => {
    spriteAnimated = s.spriteAnimated
    scene.add(s.frames.sprite)
})

// animate
const clock = new THREE.Clock()
function animate(time) {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)

    var delta = clock.getDelta()
    spriteAnimated.update(delta)
}
animate()

// Based on Lee Stemkoski's work who coded the core texture offsetting part :
// http://stemkoski.github.io/Three.js/Texture-Animation.html
