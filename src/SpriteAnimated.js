import * as THREE from 'three'

export default function SpriteAnimated() {}

SpriteAnimated.prototype.addFrames = function({
    material,
    width,
    height,
    tiles,
    flipH = false,
    flipV = false
}) {
    const texture = material.map
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping

    const defineTiles = () => {
        const image = texture.image
        const tilesHorizontal = image.width / width
        const tilesVertical = image.height / height
        texture.repeat.set(
            (flipH ? -1 : 1) / tilesHorizontal,
            (flipV ? -1 : 1) / tilesVertical
        )
        const { x, y } = getOffsetTexture({
            tile: 10,
            tilesHorizontal,
            tilesVertical,
            flipH,
            flipV
        })
        texture.offset.x = x
        texture.offset.y = y
    }

    if (texture.image !== undefined) {
        defineTiles()
    } else {
        const textureOnUpdate = texture.onUpdate
        texture.onUpdate = (...args) => {
            defineTiles()
            if (typeof textureOnUpdate === 'function') {
                textureOnUpdate(...args)
            }
            texture.onUpdate = textureOnUpdate
        }
    }

    const sprite = new THREE.Sprite(material)
    return sprite
}

function getOffsetTexture({
    tile,
    tilesHorizontal,
    tilesVertical,
    flipH,
    flipV
}) {
    tile = tile - 1
    const currentColumn = flipH
        ? tilesHorizontal - (tile % tilesHorizontal) - 1
        : tile % tilesHorizontal
    const currentRow = flipV
        ? tilesVertical - Math.floor(tile / tilesHorizontal) - 1
        : Math.floor(tile / tilesHorizontal)
    console.log({
        tile,
        currentColumn,
        currentRow,
        tilesHorizontal,
        tilesVertical
    })
    const x = currentColumn / tilesHorizontal
    const y = (tilesVertical - currentRow - 1) / tilesVertical
    return {
        x: flipH ? 1 - x : x,
        y: flipV ? 1 - y : y
    }
}
