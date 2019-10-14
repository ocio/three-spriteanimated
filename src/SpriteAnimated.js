import * as THREE from 'three'

export default function SpriteAnimated() {
    const spriteanimated = {
        playing: true,
        currentFrame: 0,
        currentDisplayTime: 0,
        frames: [],
        sprites: new THREE.Group()
    }

    spriteanimated.update = delta => {
        spriteanimated.currentDisplayTime += delta * 1000

        const currentFrame = spriteanimated.currentFrame
        const { frameDisplayDuration } = spriteanimated.frames[currentFrame]

        // console.log(spriteanimated.currentDisplayTime, frameDisplayDuration)
        while (spriteanimated.currentDisplayTime > frameDisplayDuration) {
            spriteanimated.currentDisplayTime -= frameDisplayDuration
            spriteanimated.goTo(
                currentFrame < spriteanimated.frames.length - 1
                    ? currentFrame + 1
                    : 0
            )
        }
    }

    spriteanimated.goTo = currentFrame => {
        const { frameSet, frameIndex } = spriteanimated.frames[currentFrame]

        const {
            framesHorizontal,
            framesVertical,
            flipH,
            flipV,
            texture,
            sprite
        } = frameSet

        // Hiding framesets that are not being visible
        spriteanimated.sprites.children.forEach(s => (s.visible = sprite === s))

        const { x, y } = getOffsetTexture({
            frame: frameIndex,
            framesHorizontal,
            framesVertical,
            flipH,
            flipV
        })
        texture.offset.x = x
        texture.offset.y = y
        spriteanimated.currentFrame = currentFrame
    }

    spriteanimated.addFrames = ({
        material,
        width,
        height,
        totalFrames,
        frameDisplayDuration,
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
        const frameSet = {
            sprite,
            texture,
            totalFrames,
            flipH,
            flipV
        }

        if (texture.image !== undefined) {
            const { framesHorizontal, framesVertical } = defineTiles()
            frameSet.framesHorizontal = framesHorizontal
            frameSet.framesVertical = framesVertical
            spriteanimated.goTo(0)
        } else {
            const textureOnUpdate = texture.onUpdate
            texture.onUpdate = (...args) => {
                const { framesHorizontal, framesVertical } = defineTiles()
                frameSet.framesHorizontal = framesHorizontal
                frameSet.framesVertical = framesVertical
                if (typeof textureOnUpdate === 'function') {
                    textureOnUpdate(...args)
                }
                texture.onUpdate = textureOnUpdate
                spriteanimated.goTo(0)
            }
        }

        spriteanimated.sprites.add(sprite)

        // Creating Frames
        for (let frameIndex = 0; frameIndex < totalFrames; ++frameIndex) {
            spriteanimated.frames.push({
                frameIndex,
                frameSet,
                frameDisplayDuration
            })
        }

        return frameSet
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
