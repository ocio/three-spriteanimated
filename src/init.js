import * as THREE from 'three'
// import SpriteMixer from './SpriteMixer'
import SpriteAnimated from './SpriteAnimated'

export default function init(cb) {
    // const url = 'https://i.ibb.co/mqTC0sy/spritesheet-1.png'
    // const url = 'https://i.ibb.co/Hq62Pqr/spritesheet-1.png'
    const url = 'https://i.ibb.co/RT1V9mW/both-numbers.png'
    // const url = './tiles.png'
    // const url = './tiles2.png'
    const loader = new THREE.TextureLoader()
    const material = new THREE.SpriteMaterial({ map: loader.load(url) })
    material.map.minFilter = THREE.LinearFilter

    const material2 = new THREE.SpriteMaterial({ map: loader.load(url) })
    // material2.map.minFilter = THREE.LinearFilter

    const size = 256
    const totalFrames = 62
    const fps = 30
    const frameDisplayDuration = 1000 / fps // 30 frames per second
    const soldier = SpriteAnimated()
    soldier.addFrames({
        material,
        width: size,
        height: size,
        frameDisplayDuration,
        totalFrames
    })
    soldier.addFrames({
        material: material2,
        width: size,
        height: size,
        flipH: true,
        flipV: true,
        frameDisplayDuration,
        totalFrames
    })

    // console.log(soldier.frames.length)
    // soldier.goto(29)
    // soldier.pause()
    soldier.setKeyFrame(30, {
        onEnterFrame: () => {
            console.log('onEnterFrame', soldier.currentFrame)
            // setTimeout(() => {
            //     console.log(soldier.currentFrame)
            //     soldier.goto(0).play()
            // }, 1000)
            // soldier.pause()
            return 0
        }
    })

    const scale = 10
    soldier.sprites.position.set(5, 5, 5)
    soldier.sprites.scale.set(scale, scale, scale)
    cb({ soldier })
}

// export default function init(cb) {
//     // const url = 'https://i.ibb.co/mqTC0sy/spritesheet-1.png'
//     const url = 'https://i.ibb.co/8BM8NTR/both-numbers.png'
//     const loader = new THREE.TextureLoader()
//     loader.load(url, texture => {
//         const material = new THREE.SpriteMaterial({
//             map: texture
//             // color: 0xffffff,
//             // premultipliedAlpha: true,
//             // alphaTest: 1
//         })
//         material.map.minFilter = THREE.LinearFilter

//         const soldier = new SpriteAnimated()
//         const warrior = soldier.addFrames({
//             material,
//             width: 256,
//             height: 256,
//             tiles: 31
//         })

//         const scale = 10
//         warrior.position.set(5, 5, 5)
//         warrior.scale.set(scale, scale, scale)
//         cb({ warrior, soldier })
//     })
// }

// export default function init(cb) {
//     var loader = new THREE.TextureLoader()
//     var soldier = SpriteMixer()
//     // const url = 'https://i.ibb.co/5LyxShK/spritesheet-1.png'
//     // const url = 'https://i.ibb.co/Hq62Pqr/spritesheet-1.png'
//     const url = 'https://i.ibb.co/RT1V9mW/both-numbers.png'
//     // const url = 'https://i.ibb.co/kgb5R0J/spritesheet-3.png'
//     // "https://felixmariotto.github.io/textures/warrior.png"
//     const texture = loader.load(url)
//     const warrior = soldier.ActionSprite(texture, 31, 2, 62, 25)
//     // warrior = spriteMixer.ActionSprite(texture, 6, 6, 31, 25);

//     const scale = 15
//     warrior.position.set(5, 5, 5)
//     warrior.scale.set(scale, scale, scale)
//     // warrior.material.map.repeat.set(-1, 1);
//     // warrior.material.map.offset.set( 1, 0);
//     cb({ warrior, soldier })
// }
