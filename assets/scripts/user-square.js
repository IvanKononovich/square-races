class UserSquare {
    constructor({ ctx }) {
        this.ctx = ctx
        this.squareStyle = 'green'
        this.w = 100
        this.h = 100
        this.pos = {
            prev: {
                x: 0,
                y: 0,
            },
            x: 0,
            y: 0,
        }

        this.render = this.render.bind(this)

        this.init()
    }

    calcNewPos({ direction, directionValue, squareSize, windowSize }) {
        let newDirection = this.pos[direction] + directionValue * this[squareSize]

        if (newDirection + this[squareSize] >= window[windowSize]) {
            return
        }
        if (newDirection < 0) {
            return
        }

        this.pos.prev[direction] = this.pos[direction]
        this.pos[direction] = newDirection

        this.render()
    }

    move({ x = 0, y = 0 }) {
        this.calcNewPos({ direction: 'x', directionValue: x, squareSize: 'w', windowSize: 'innerWidth' })
        this.calcNewPos({ direction: 'y', directionValue: y, squareSize: 'h', windowSize: 'innerHeight' })
    }

    handleMove() {
        document.addEventListener('keydown', (event) => {
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
        })
    }

    render() {
        const { x, y, prev } = this.pos
        ctx.clearRect(prev.x, prev.y, this.w, this.h);

        ctx.beginPath()

        ctx.rect(x, y, this.w, this.h)
        ctx.fillStyle = this.squareStyle
        ctx.fill()

        requestAnimationFrame(this.render)
    }

    init() {
        requestAnimationFrame(this.render)

        this.handleMove()
    }
}
