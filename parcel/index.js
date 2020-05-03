// https://www.codeandweb.com/free-sprite-sheet-packer
import './styles.css'
import * as THREE from 'three'
import SpriteAnimated from '../src'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const loader = new THREE.TextureLoader()

const scale = 5
const framesHorizontal = 30
const framesVertical = 2

// INTERESTING
function create() {
    const texture1 = loader.load('http://localhost:1234/60.png')
    const material = new THREE.MeshBasicMaterial({
        map: texture1,
        transparent: true,
    })
    material.map.minFilter = THREE.LinearFilter
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), material)
    const soldier1 = SpriteAnimated()
    soldier1.addFrames({
        object: mesh,
        framesHorizontal,
        framesVertical,
        // flipHorizontal,
        // flipVertical,
        // frameDisplayDuration: 1000 / fps, // 30 frames per second,
    })
    soldier1.setKeyFrame(29, { onLeaveFrame: () => 0 })
    soldier1.setKeyFrame(59, { onLeaveFrame: () => 30 })
    soldier1.objects.scale.set(scale, scale, scale)

    const texture2 = loader.load('http://localhost:1234/60.png')
    const material2 = new THREE.SpriteMaterial({ map: texture2 })
    material2.map.minFilter = THREE.LinearFilter
    const sprite = new THREE.Sprite(material2)
    const soldier2 = SpriteAnimated()
    soldier2.addFrames({
        object: sprite,
        framesHorizontal,
        framesVertical,
    })
    soldier2.setKeyFrame(29, { onLeaveFrame: () => 0 })
    soldier2.setKeyFrame(59, { onLeaveFrame: () => 30 })
    soldier2.objects.scale.set(scale, scale, scale)

    return { soldier1, soldier2 }
}

// NOT INTERESTING
// NOT INTERESTING
// NOT INTERESTING

const cameraPosition = 200
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
const camera = new THREE.PerspectiveCamera(
    5, // fov
    window.innerWidth / window.innerHeight, // aspect
    1, // near
    999999 // far
)
const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(cameraPosition, cameraPosition, cameraPosition)
camera.lookAt(new THREE.Vector3(0, 0, 0))
renderer.setSize(window.innerWidth, window.innerHeight)

// geometry
const grid = new THREE.GridHelper(50, 50, 0x426800, 0x426800)
grid.position.y = -1
scene.add(grid)

document.body.appendChild(renderer.domElement)

const { soldier1, soldier2 } = create()
window.soldier1 = soldier1
window.soldier2 = soldier2
soldier2.objects.position.set(5, 0, 5)
scene.add(soldier1.objects)
scene.add(soldier2.objects)

// animate
const clock = new THREE.Clock()
function animate(time) {
    ;[scene].forEach((scene) => {
        renderer.render(scene, camera)
        // renderer_css.render(scene, camera)
        renderer.clearDepth()
    })

    controls.update()
    requestAnimationFrame(animate)

    var delta = clock.getDelta()
    soldier1.update(delta)
    soldier2.update(delta)
}
animate()

controls.addEventListener('change', () => {
    soldier1.objects.quaternion.copy(camera.quaternion)
})
