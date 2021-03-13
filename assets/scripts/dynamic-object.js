class DynamicObject {
    constructor({ ctx, renderManager, userSquare }) {
        this.ctx = ctx
        this.renderManager = renderManager
        this.userSquare = userSquare
        this.mainStyle = 'rgb(0, 0, 51)'
        this.style = 'rgb(0, 0, 51)'
        this.w = Math.floor(window.innerWidth / 50)
        this.h = Math.floor(window.innerHeight / 10)
        this.pos = {
            prev: {
                x: 0,
                y: 0,
            },
            x: 0,
            y: 0,
        }
        this.renderPriority = 0

        this.isPixelMove = false
        this.withoutBorders = false

        this.render = this.render.bind(this)

        this.init()
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    calcNewPos({ direction, directionValue, squareSize, windowSize }) {
        let newDirection = this.pos[direction] + (this.isPixelMove ? directionValue : directionValue * this[squareSize])

        if (!this.withoutBorders) {
            if (newDirection + this[squareSize] > window[windowSize]) {
                return
            }
            if (newDirection < 0) {
                return
            }
        }

        this.pos.prev[direction] = this.pos[direction]
        this.pos[direction] = newDirection

        ctx.clearRect(this.pos.prev.x, this.pos.prev.y, this.w, this.h);
    }

    move({ x = 0, y = 0 }) {
        this.calcNewPos({ direction: 'x', directionValue: x, squareSize: 'w', windowSize: 'innerWidth' })
        this.calcNewPos({ direction: 'y', directionValue: y, squareSize: 'h', windowSize: 'innerHeight' })
    }

    render() {
        const { x, y, prev } = this.pos
        ctx.clearRect(prev.x, prev.y, this.w, this.h);

        ctx.beginPath()
        ctx.rect(x, y, this.w, this.h)
        ctx.fillStyle = this.style
        ctx.fill()

        this.pos.prev = { x, y }
    }

    init() {
        this.renderManager.add({
            priority: this.renderPriority,
            renderFunction: this.render,
        }, this.renderId)
    }
}
