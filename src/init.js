import * as THREE from 'three'
// import SpriteMixer from './SpriteMixer'
import SpriteAnimated from './SpriteAnimated'

export default function init(cb) {
    // const url = 'https://i.ibb.co/mqTC0sy/spritesheet-1.png'
    // const url = 'https://i.ibb.co/Hq62Pqr/spritesheet-1.png'
    // const url = 'https://i.ibb.co/RT1V9mW/both-numbers.png'
    const url = './tiles.png'
    const url2 = './tiles2.png'
    const loader = new THREE.TextureLoader()
    const texture = loader.load(url)
    const material = new THREE.SpriteMaterial({
        map: texture
    })
    material.map.minFilter = THREE.LinearFilter

    const texture2 = loader.load(url2)
    const material2 = new THREE.SpriteMaterial({
        map: texture2
    })
    material2.map.minFilter = THREE.LinearFilter

    const spriteAnimated = SpriteAnimated()
    spriteAnimated.addFrames({
        material,
        width: 256,
        height: 256,
        frameDisplayDuration: 1000 / 30, // 30 frames per second
        totalFrames: 63
    })
    spriteAnimated.addFrames({
        material: material2,
        width: 256,
        height: 256,
        flipH: true,
        frameDisplayDuration: 1000 / 30,
        totalFrames: 63
    })
    const scale = 10
    spriteAnimated.sprites.position.set(5, 5, 5)
    spriteAnimated.sprites.scale.set(scale, scale, scale)
    cb({ spriteAnimated })
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

//         const spriteAnimated = new SpriteAnimated()
//         const warrior = spriteAnimated.addFrames({
//             material,
//             width: 256,
//             height: 256,
//             tiles: 31
//         })

//         const scale = 10
//         warrior.position.set(5, 5, 5)
//         warrior.scale.set(scale, scale, scale)
//         cb({ warrior, spriteAnimated })
//     })
// }

// export default function init(cb) {
//     var loader = new THREE.TextureLoader()
//     var spriteAnimated = SpriteMixer()
//     // const url = 'https://i.ibb.co/5LyxShK/spritesheet-1.png'
//     // const url = 'https://i.ibb.co/Hq62Pqr/spritesheet-1.png'
//     const url = 'https://i.ibb.co/RT1V9mW/both-numbers.png'
//     // const url = 'https://i.ibb.co/kgb5R0J/spritesheet-3.png'
//     // "https://felixmariotto.github.io/textures/warrior.png"
//     const texture = loader.load(url)
//     const warrior = spriteAnimated.ActionSprite(texture, 31, 2, 62, 25)
//     // warrior = spriteMixer.ActionSprite(texture, 6, 6, 31, 25);

//     const scale = 15
//     warrior.position.set(5, 5, 5)
//     warrior.scale.set(scale, scale, scale)
//     // warrior.material.map.repeat.set(-1, 1);
//     // warrior.material.map.offset.set( 1, 0);
//     cb({ warrior, spriteAnimated })
// }
