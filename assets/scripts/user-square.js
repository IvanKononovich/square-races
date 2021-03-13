class UserSquare extends DynamicObject {
    constructor(props) {
        super(props)

        this.mainStyle = 'rgba(0, 0, 51, 1)'
        this.style = this.mainStyle

        this.collisionEnabled = true
        this.pulseStyle = {
            index: 0,
            listStyles: [
                'rgba(0, 0, 51, 1)',
                'rgba(0, 0, 51, 0.9)',
                'rgba(0, 0, 51, 0.8)',
                'rgba(0, 0, 51, 0.7)',
                'rgba(0, 0, 51, 0.6)',
                'rgba(0, 0, 51, 0.5)',
                'rgba(0, 0, 51, 0.4)',
                'rgba(0, 0, 51, 0.3)',
                'rgba(0, 0, 51, 0.2)',
                'rgba(0, 0, 51, 0.1)',
                "rgba(0, 0, 51, 0.1)",
                "rgba(0, 0, 51, 0.2)",
                "rgba(0, 0, 51, 0.3)",
                "rgba(0, 0, 51, 0.4)",
                "rgba(0, 0, 51, 0.5)",
                "rgba(0, 0, 51, 0.6)",
                "rgba(0, 0, 51, 0.7)",
                "rgba(0, 0, 51, 0.8)",
                "rgba(0, 0, 51, 0.9)",
                "rgba(0, 0, 51, 1)"
            ]
        }
        this.pulseTime = 1000
    }

    addScore(id) {
        this.score.add(id)
    }

    removeScore(id) {
        this.score.delete(id)
    }

    hadleKeydown(event) {
        const { code } = event

        switch (code) {
            case 'ArrowUp':
                this.move({ y: -1 })
                break
            case 'ArrowDown':
                this.move({ y: 1 })
                break
            case 'ArrowLeft':
                this.move({ x: -1 })
                break
            case 'ArrowRight':
                this.move({ x: 1 })
                break
        }
    }

    hadleTouchstart(event) {
        const x = event.touches[0].pageX
        const y = event.touches[0].pageY

        if (x > this.pos.x + this.w) {
            this.move({ x: 1 })
        }
        if (x < this.pos.x) {
            this.move({ x: -1 })
        }
        if (y > this.pos.y + this.h) {
            this.move({ y: 1 })
        }
        if (y < this.pos.y) {
            this.move({ y: -1 })
        }
    }

    handleMove() {
        document.addEventListener('keydown', this.hadleKeydown)
        document.addEventListener('touchstart', this.hadleTouchstart)
    }

    render() {
        super.render()

        ctx.beginPath()
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = '#ffffff'
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.score.size, this.pos.x + this.w / 2, this.pos.y + this.h / 2);

        if (this.collisionEnabled) return

        this.style = this.pulseStyle.listStyles[this.pulseStyle.index]

        this.pulseStyle.index += 1

        if (this.pulseStyle.index > this.pulseStyle.listStyles.length - 1) {
            this.pulseStyle.index = 0
        }

        if (performance.now() - this.startCollisionTime > this.pulseTime) {
            this.collisionEnabled = true
            this.pulseStyle.index = 0
            this.style = this.mainStyle
        }
    }

    collision() {
        this.collisionEnabled = false
        this.startCollisionTime = performance.now()
    }

    init() {
        this.renderPriority = Infinity
        this.renderId = 'UserSquare'
        this.hadleKeydown = this.hadleKeydown.bind(this)
        this.hadleTouchstart = this.hadleTouchstart.bind(this)
        this.score = new Set()

        super.init()

        this.handleMove()

        this.renderManager.add({
            priority: this.renderPriority,
            renderFunction: this.render,
        }, this.renderId)
    }
}
