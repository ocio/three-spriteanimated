// https://www.codeandweb.com/free-sprite-sheet-packer
import './styles.css'
import * as THREE from 'three'
import SpriteAnimated from '../src'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// INTERESTING
function init(cb) {
    const soldier = SpriteAnimated()
    addFrames(soldier, 'http://localhost:1234/60.png', 30, 2)
    addFrames(soldier, 'http://localhost:1234/60.png', 30, 2, true)
    // addFrames(soldier, 'https://i.ibb.co/Z1sVZks/tiles.png', 32, 2)
    // addFrames(soldier, 'https://i.ibb.co/Hq62Pqr/objectsheet-1.png', 1, 31)

    // console.log(soldier.frames.length)
    // soldier.goto(72)
    // soldier.pause()
    soldier.setKeyFrame(29, {
        onLeaveFrame: () => 0,
    })
    soldier.setKeyFrame(59, {
        onLeaveFrame: () => 30,
    })
    soldier.setKeyFrame(89, {
        onLeaveFrame: () => 60,
    })
    soldier.setKeyFrame(119, {
        onLeaveFrame: () => 90,
    })

    const scale = 5
    soldier.objects.position.set(0, 1, 0)
    soldier.objects.scale.set(scale, scale, scale)
    return soldier
}

function addFrames(
    soldier,
    url,
    framesHorizontal,
    framesVertical,
    flipHorizontal = false,
    flipVertical = false,
    fps = 30
) {
    const loader = new THREE.TextureLoader()
    const material = new THREE.SpriteMaterial({ map: loader.load(url) })
    const sprite = new THREE.Sprite(material)
    material.map.minFilter = THREE.LinearFilter

    soldier.addFrames({
        object: sprite,
        framesHorizontal,
        framesVertical,
        flipHorizontal,
        flipVertical,
        frameDisplayDuration: 1000 / fps, // 30 frames per second,
    })
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

window.soldier = init()
scene.add(window.soldier.objects)

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
    window.soldier.update(delta)
}
animate()
