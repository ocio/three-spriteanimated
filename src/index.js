import * as THREE from 'three'

export default function SpriteAnimated() {
    const animation = {
        playing: true,
        currentFrame: 0,
        currentDisplayTime: 0,
        frames: [],
        sprites: new THREE.Group(),
    }

    animation.getFrame = () => {
        return animation.currentFrame
    }

    animation.update = (delta) => {
        if (animation.playing) {
            animation.currentDisplayTime += delta * 1000

            const currentFrame = animation.currentFrame
            const { frameDisplayDuration, onLeaveFrame } = animation.frames[
                currentFrame
            ]

            // console.log(animation.currentDisplayTime, frameDisplayDuration)
            while (animation.currentDisplayTime > frameDisplayDuration) {
                animation.currentDisplayTime -= frameDisplayDuration

                if (typeof onLeaveFrame == 'function') {
                    const newCurrentFrame = onLeaveFrame(animation)
                    if (typeof newCurrentFrame == 'number') {
                        return animation.goto(newCurrentFrame)
                    }
                }

                animation.goto(
                    currentFrame < animation.frames.length - 1
                        ? currentFrame + 1
                        : 0
                )
            }
        }
    }

    animation.play = () => {
        animation.playing = true
        return animation
    }

    animation.pause = () => {
        animation.playing = false
        return animation
    }

    animation.goto = (currentFrame) => {
        const { frameSet, frameIndex } = animation.frames[currentFrame]

        const {
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical,
            texture,
            sprite,
        } = frameSet

        // Hiding framesets animation are not being used
        animation.sprites.children.forEach((s) => (s.visible = sprite === s))

        const { col, row } = getPositionByFrame({
            frame: frameIndex,
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical,
        })

        const { x, y } = getOffsetByPosition({
            col,
            row,
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical,
        })

        console.log({ col, row, x, y })

        texture.offset.x = x
        texture.offset.y = y
        animation.currentFrame = currentFrame

        // if (typeof onEnterFrame == 'function') {
        //     const newCurrentFrame = onEnterFrame()
        //     if (typeof newCurrentFrame == 'number') {
        //         animation.goto(newCurrentFrame)
        //     }
        // }

        return animation
    }

    animation.setKeyFrame = (frame, { onLeaveFrame }) => {
        // const object = animation.frames[frame]
        // animation.frames[frame] = { ...object, ...options }
        animation.frames[frame].onLeaveFrame = onLeaveFrame
    }

    animation.addFrames = ({
        material,
        framesHorizontal,
        framesVertical,
        totalFrames = framesHorizontal * framesVertical,
        frameDisplayDuration = 1000 / 30, // 30 frames per second,
        flipHorizontal = false,
        flipVertical = false,
    }) => {
        const texture = material.map
        const sprite = new THREE.Sprite(material)
        const frameSet = {
            sprite,
            texture,
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical,
        }

        // Creating Frames
        for (let frameIndex = 0; frameIndex < totalFrames; ++frameIndex) {
            animation.frames.push({
                frameIndex,
                frameSet,
                frameDisplayDuration,
            })
        }

        texture.repeat.set(
            (flipHorizontal ? -1 : 1) / framesHorizontal,
            (flipVertical ? -1 : 1) / framesVertical
        )

        animation.sprites.add(sprite)
        animation.goto(animation.currentFrame)

        return frameSet
    }

    return animation
}

function getPositionByFrame({
    frame,
    framesHorizontal,
    framesVertical,
    flipHorizontal,
    flipVertical,
}) {
    let col = frame % framesHorizontal
    let row = Math.floor(frame / framesHorizontal)

    if (flipHorizontal) col = framesHorizontal - col - 1
    if (flipVertical) row = framesVertical - row - 1

    return { col, row }
}

function getOffsetByPosition({
    col,
    row,
    framesVertical,
    framesHorizontal,
    flipHorizontal,
    flipVertical,
}) {
    const x = col / framesHorizontal
    const y = (framesVertical - row - 1) / framesVertical

    return {
        x: flipHorizontal ? 1 - x : x,
        y: flipVertical ? 1 - y : y,
    }
}

// function getCellUv({ x = 0, y = 0, cols, rows }) {
//     const colsdiv = 1 / cols
//     const rowsdiv = 1 / rows
//     const realx = x
//     const realy = rows - y - 1
//     return [
//         [realx * colsdiv, realy * rowsdiv],
//         [realx * colsdiv + colsdiv, realy * rowsdiv],
//         [realx * colsdiv, realy * rowsdiv + rowsdiv],
//         [realx * colsdiv + colsdiv, realy * rowsdiv + rowsdiv],
//     ]
// }

// getCellUv({ x: 4, y: 1, cols: 8, rows: 4 }).forEach(([x, y], index) => {
//     planeGeom.attributes.uv.setXY(index, x, y)
// })
