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
            const { frameDisplayDuration } = that.frames[currentFrame]

            // console.log(that.currentDisplayTime, frameDisplayDuration)
            while (that.currentDisplayTime > frameDisplayDuration) {
                that.currentDisplayTime -= frameDisplayDuration
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
        const { frameSet, frameIndex, onEnterFrame } = that.frames[currentFrame]

        const {
            framesHorizontal,
            framesVertical,
            flipH,
            flipV,
            texture,
            sprite
        } = frameSet

        // Hiding framesets that are not being used
        that.sprites.children.forEach(s => (s.visible = sprite === s))

        const { x, y, column, row } = getOffsetTexture({
            frame: frameIndex,
            framesHorizontal,
            framesVertical,
            flipH,
            flipV
        })

        texture.offset.x = x
        texture.offset.y = y
        that.currentFrame = currentFrame

        if (typeof onEnterFrame == 'function') {
            const newCurrentFrame = onEnterFrame()
            if (typeof newCurrentFrame == 'number') {
                that.goto(newCurrentFrame)
            }
        }

        return that
    }

    that.setKeyFrame = (frame, options) => {
        const object = that.frames[frame]
        that.frames[frame] = { ...object, ...options }
    }

    that.addFrames = ({
        material,
        width,
        height,
        totalFrames,
        frameDisplayDuration = 1000 / 30, // 30 frames per second,
        flipH = false,
        flipV = false
    }) => {
        const texture = material.map
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping

        const sprite = new THREE.Sprite(material)
        const frameSet = {
            sprite,
            texture,
            totalFrames,
            flipH,
            flipV
        }

        if (texture.image !== undefined) {
            const { framesHorizontal, framesVertical } = getFramesCount({
                texture,
                width,
                height,
                flipH,
                flipV
            })
            frameSet.framesHorizontal = framesHorizontal
            frameSet.framesVertical = framesVertical
            that.goto(that.currentFrame)
        } else {
            const textureOnUpdate = texture.onUpdate
            texture.onUpdate = (...args) => {
                if (typeof textureOnUpdate === 'function')
                    textureOnUpdate(...args)

                texture.onUpdate = textureOnUpdate
                const { framesHorizontal, framesVertical } = getFramesCount({
                    texture,
                    width,
                    height,
                    flipH,
                    flipV
                })
                frameSet.framesHorizontal = framesHorizontal
                frameSet.framesVertical = framesVertical
                that.goto(that.currentFrame)
            }
        }

        that.sprites.add(sprite)

        // Creating Frames
        for (let frameIndex = 0; frameIndex < totalFrames; ++frameIndex) {
            that.frames.push({
                frameIndex,
                frameSet,
                frameDisplayDuration
            })
        }

        return frameSet
    }

    return that
}

function getOffsetTexture({
    frame,
    framesHorizontal,
    framesVertical,
    flipH,
    flipV
}) {
    framesHorizontal = framesHorizontal - 1
    const column = flipH
        ? framesHorizontal - (frame % framesHorizontal)
        : frame % framesHorizontal
    const row = flipV
        ? framesVertical - Math.floor(frame / framesHorizontal) - 1
        : Math.floor(frame / framesHorizontal)

    const x = column / (framesHorizontal + 1)
    const y = (framesVertical - row - 1) / framesVertical
    return {
        x: flipH ? 1 - x : x,
        y: flipV ? 1 - y : y,
        column,
        row
    }
}

function getFramesCount({ texture, width, height, flipH, flipV }) {
    const framesHorizontal = texture.image.width / width
    const framesVertical = texture.image.height / height
    texture.repeat.set(
        (flipH ? -1 : 1) / framesHorizontal,
        (flipV ? -1 : 1) / framesVertical
    )
    return { framesHorizontal, framesVertical }
}
