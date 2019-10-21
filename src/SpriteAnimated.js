import * as THREE from 'three'

export default function SpriteAnimated() {
    const that = {
        playing: true,
        currentFrame: 0,
        currentDisplayTime: 0,
        frames: [],
        sprites: new THREE.Group()
    }

    that.update = delta => {
        if (that.playing) {
            that.currentDisplayTime += delta * 1000

            const currentFrame = that.currentFrame
            const { frameDisplayDuration, onLeaveFrame } = that.frames[
                currentFrame
            ]

            // console.log(that.currentDisplayTime, frameDisplayDuration)
            while (that.currentDisplayTime > frameDisplayDuration) {
                that.currentDisplayTime -= frameDisplayDuration

                if (typeof onLeaveFrame == 'function') {
                    const newCurrentFrame = onLeaveFrame(that)
                    if (typeof newCurrentFrame == 'number') {
                        return that.goto(newCurrentFrame)
                    }
                }

                that.goto(
                    currentFrame < that.frames.length - 1 ? currentFrame + 1 : 0
                )
            }
        }
    }

    that.play = () => {
        that.playing = true
        return that
    }

    that.pause = () => {
        that.playing = false
        return that
    }

    that.goto = currentFrame => {
        const { frameSet, frameIndex } = that.frames[currentFrame]

        const {
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical,
            texture,
            sprite
        } = frameSet

        // Hiding framesets that are not being used
        that.sprites.children.forEach(s => (s.visible = sprite === s))

        const { x, y } = getOffsetTexture({
            frame: frameIndex,
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical
        })

        texture.offset.x = x
        texture.offset.y = y
        that.currentFrame = currentFrame

        // if (typeof onEnterFrame == 'function') {
        //     const newCurrentFrame = onEnterFrame()
        //     if (typeof newCurrentFrame == 'number') {
        //         that.goto(newCurrentFrame)
        //     }
        // }

        return that
    }

    that.setKeyFrame = (frame, options) => {
        const object = that.frames[frame]
        that.frames[frame] = { ...object, ...options }
    }

    that.addFrames = ({
        material,
        framesHorizontal,
        framesVertical,
        totalFrames = framesHorizontal * framesVertical,
        frameDisplayDuration = 1000 / 30, // 30 frames per second,
        flipHorizontal = false,
        flipVertical = false
    }) => {
        const texture = material.map
        const sprite = new THREE.Sprite(material)
        const frameSet = {
            sprite,
            texture,
            framesHorizontal,
            framesVertical,
            flipHorizontal,
            flipVertical
        }

        // Creating Frames
        for (let frameIndex = 0; frameIndex < totalFrames; ++frameIndex) {
            that.frames.push({
                frameIndex,
                frameSet,
                frameDisplayDuration
            })
        }

        texture.repeat.set(
            (flipHorizontal ? -1 : 1) / framesHorizontal,
            (flipVertical ? -1 : 1) / framesVertical
        )

        that.sprites.add(sprite)
        that.goto(that.currentFrame)

        return frameSet
    }

    return that
}

function getOffsetTexture({
    frame,
    framesHorizontal,
    framesVertical,
    flipHorizontal,
    flipVertical
}) {
    let column = frame % framesHorizontal
    let row = Math.floor(frame / framesHorizontal)

    if (flipHorizontal) column = framesHorizontal - column - 1
    if (flipVertical) row = framesVertical - row - 1

    const x = column / framesHorizontal
    const y = (framesVertical - row - 1) / framesVertical

    return {
        x: flipHorizontal ? 1 - x : x,
        y: flipVertical ? 1 - y : y
    }
}
