import * as THREE from 'three'

export default function SpriteAnimated() {
    const spriteanimated = {}
    const framesets = []

    spriteanimated.currentFrame = 1
    spriteanimated.currentDisplayTime = 0
    spriteanimated.tileDisplayDuration = 40 // milliSec

    spriteanimated.currentDisplayTime > spriteanimated.tileDisplayDuration

    spriteanimated.update = delta => {
        spriteanimated.currentDisplayTime += delta * 1000
        if (
            spriteanimated.currentDisplayTime >
            spriteanimated.tileDisplayDuration
        ) {
            spriteanimated.currentDisplayTime = 0
            const currentFrame =
                spriteanimated.currentFrame > 30
                    ? 1
                    : spriteanimated.currentFrame + 1
            spriteanimated.goTo(currentFrame)
        }
    }

    spriteanimated.goTo = frame => {
        const {
            framesHorizontal,
            framesVertical,
            flipH,
            flipV,
            texture
        } = framesets[0]
        const { x, y } = getOffsetTexture({
            frame,
            framesHorizontal,
            framesVertical,
            flipH,
            flipV
        })
        texture.offset.x = x
        texture.offset.y = y
        spriteanimated.currentFrame = frame
    }

    spriteanimated.addFrames = ({
        material,
        width,
        height,
        totalFrames,
        flipH = false,
        flipV = false
    }) => {
        const texture = material.map
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping

        const defineTiles = () => {
            const framesHorizontal = texture.image.width / width
            const framesVertical = texture.image.height / height
            texture.repeat.set(
                (flipH ? -1 : 1) / framesHorizontal,
                (flipV ? -1 : 1) / framesVertical
            )
            return { framesHorizontal, framesVertical }
        }

        const sprite = new THREE.Sprite(material)
        const frameset = {
            sprite,
            texture,
            totalFrames,
            flipH,
            flipV
        }

        if (texture.image !== undefined) {
            const { framesHorizontal, framesVertical } = defineTiles()
            frameset.framesHorizontal = framesHorizontal
            frameset.framesVertical = framesVertical
            spriteanimated.goTo(1)
        } else {
            const textureOnUpdate = texture.onUpdate
            texture.onUpdate = (...args) => {
                const { framesHorizontal, framesVertical } = defineTiles()
                frameset.framesHorizontal = framesHorizontal
                frameset.framesVertical = framesVertical
                if (typeof textureOnUpdate === 'function') {
                    textureOnUpdate(...args)
                }
                texture.onUpdate = textureOnUpdate
                spriteanimated.goTo(1)
            }
        }

        framesets.push(frameset)
        return frameset
    }

    return spriteanimated
}

function getOffsetTexture({
    frame,
    framesHorizontal,
    framesVertical,
    flipH,
    flipV
}) {
    frame = frame - 1
    const currentColumn = flipH
        ? framesHorizontal - (frame % framesHorizontal) - 1
        : frame % framesHorizontal
    const currentRow = flipV
        ? framesVertical - Math.floor(frame / framesHorizontal) - 1
        : Math.floor(frame / framesHorizontal)
    const x = currentColumn / framesHorizontal
    const y = (framesVertical - currentRow - 1) / framesVertical
    return {
        x: flipH ? 1 - x : x,
        y: flipV ? 1 - y : y
    }
}
