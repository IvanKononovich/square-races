class DynamicObject {
    constructor({ ctx, renderManager, wallManager, userSquare }) {
        this.ctx = ctx
        this.renderManager = renderManager
        this.userSquare = userSquare
        this.wallManager = wallManager
        this.mainStyle = 'rgb(0, 0, 51)'
        this.style = 'rgb(0, 0, 51)'
        this.w = Math.floor(window.innerWidth / COUNT_CELLS)
        this.h = this.w
        this.pos = {
            prev: {
                x: 0,
                y: 0,
            },
            clearPos: {
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

        this.pos.clearPos[direction] = this.pos[direction]
        this.pos.prev[direction] = this.pos[direction]
        this.pos[direction] = newDirection
    }

    move({ x = 0, y = 0 }) {
        this.calcNewPos({ direction: 'x', directionValue: x, squareSize: 'w', windowSize: 'innerWidth' })
        this.calcNewPos({ direction: 'y', directionValue: y, squareSize: 'h', windowSize: 'innerHeight' })
    }

    render() {
        const { x, y, clearPos } = this.pos
        ctx.beginPath()
        ctx.clearRect(clearPos.x, clearPos.y, this.w + 1, this.h);

        ctx.beginPath()
        ctx.fillStyle = this.style
        ctx.rect(x, y, this.w, this.h)
        ctx.fill()

        this.pos.clearPos = { x, y }
    }

    init() {
        canvas.height = canvas.height - canvas.height % this.w
        canvas.style.height = canvas.height
    }
}
