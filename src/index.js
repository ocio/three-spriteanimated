// https://www.codeandweb.com/free-sprite-sheet-packer
import './styles.css'
import * as THREE from 'three'
import SpriteAnimated from './SpriteAnimated'

// INTERESTING
function init(cb) {
    const soldier = SpriteAnimated()
    addFrames(soldier, 'https://i.ibb.co/k0sw5NS/60.png', 30, 2)
    addFrames(soldier, 'https://i.ibb.co/k0sw5NS/60.png', 30, 2, true)
    // addFrames(soldier, 'https://i.ibb.co/Z1sVZks/tiles.png', 32, 2)
    // addFrames(soldier, 'https://i.ibb.co/Hq62Pqr/spritesheet-1.png', 1, 31)

    // console.log(soldier.frames.length)
    // soldier.goto(72)
    // soldier.pause()
    soldier.setKeyFrame(29, {
        onLeaveFrame: () => 0
    })
    soldier.setKeyFrame(59, {
        onLeaveFrame: () => 30
    })
    soldier.setKeyFrame(89, {
        onLeaveFrame: () => 60
    })
    soldier.setKeyFrame(119, {
        onLeaveFrame: () => 90
    })

    const scale = 10
    soldier.sprites.position.set(5, 5, 5)
    soldier.sprites.scale.set(scale, scale, scale)
    return soldier
}

function addFrames(
    soldier,
    url,
    framesHorizontal,
    framesVertical,
    flipHorizontal = false,
    flipVertical = false,
    fps = 5
) {
    const loader = new THREE.TextureLoader()
    const material = new THREE.SpriteMaterial({ map: loader.load(url) })
    material.map.minFilter = THREE.LinearFilter

    soldier.addFrames({
        material,
        framesHorizontal,
        framesVertical,
        flipHorizontal,
        flipVertical,
        frameDisplayDuration: 1000 / fps // 30 frames per second,
    })
}

// NOT INTERESTING
// NOT INTERESTING
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

window.soldier = init()
scene.add(window.soldier.sprites)

// animate
const clock = new THREE.Clock()
function animate(time) {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)

    var delta = clock.getDelta()
    window.soldier.update(delta)
}
animate()
