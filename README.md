# Install

`npm i @ocio/three-spriteanimated`

# API

```js
import SpriteAnimated from '@ocio/three-spriteanimated'
const soldier = SpriteAnimated()
```

## Methods

### .play()

### .pause()

### .goto(number)

### .update(delta)

### .addFrames({ material, framesHorizontal, framesVertical, [flipHorizontal, flipVertical, frameDisplayDuration ]})

```js
soldier.addFrames({
    material,
    framesHorizontal: 30,
    framesVertical: 2
    // flipHorizontal: false,
    // flipVertical: false,
    // frameDisplayDuration: 1000 / 30
})
```

### .sprites

```js
scene.add(soldier.sprites) // .sprites is a THREE.Group
```

### .setKeyFrame(number, { onLeaveFrame })

```js
// When the 29 frame is about to end we move to the 0 frame to generate a loop
soldier.setKeyFrame(29, {
    onLeaveFrame: () => 0
})
```

# Quick Example

```js
// https://www.codeandweb.com/free-sprite-sheet-packer
import * as THREE from 'three'
import SpriteAnimated from '@ocio/three-spriteanimated'

// BASIC THREE WORLD
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
const camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    1,
    999999
)
camera.position.set(5, 5, 5)
camera.lookAt(new THREE.Vector3(0, 0, 0))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// BASIC THREE WORLD

// Importing texture
const url = 'https://i.ibb.co/k0sw5NS/60.png'
const loader = new THREE.TextureLoader()
const material = new THREE.SpriteMaterial({ map: loader.load(url) })

// Creating sprite
const soldier = SpriteAnimated()
soldier.addFrames({
    material,
    framesHorizontal: 30,
    framesVertical: 2
})
scene.add(soldier.sprites)

// animate
const clock = new THREE.Clock()
function animate(time) {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)

    soldier.update(clock.getDelta()) // We must update our sprite any time
}
animate()
```

# Demos

Basic: https://codesandbox.io/s/withered-sky-50bde

Advanced: https://codesandbox.io/s/spriteanimated-ybrt1

# Tools (Texture Packers)

https://www.codeandweb.com/free-sprite-sheet-packer
https://www.codeandweb.com/texturepacker
http://free-tex-packer.com/download/
