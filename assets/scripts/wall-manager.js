class WallManager {
    constructor({ ctx, renderManager, userSquare }) {
        this.ctx = ctx
        this.renderManager = renderManager
        this.userSquare = userSquare
        this.listWalls = []
        this.countWalls = 3
        this.intervalCreation = window.innerWidth / 5
        this.originSpeed = 1
        this.speed = this.originSpeed
        this.countWallHole = 1
        this.wallSize = { w: 100, h: window.innerHeight }
        this.intervalCreationId = null
        this.render = this.render.bind(this)
        this.slowdownDuration = 300

        this.init()
    }

    slowDownWalls() {
        this.speed = 0
        this.listWalls.forEach((wall) => {
            wall.speed = this.speed
        })

        this.startSlowDownWalls = performance.now()
    }

    handleMove() {
        const userSquareOriginMove = this.userSquare.move.bind(this.userSquare)

        this.userSquare.move = (props) => {
            if (typeof props.y === 'number') {
                this.slowDownWalls()
            }
            userSquareOriginMove(props)
        }
    }

    createWall() {
        const { ctx, renderManager, userSquare } = this
        const wall = new Wall({ ctx, renderManager, userSquare })
        wall.speed = this.speed
        this.listWalls.push(wall)
    }

    startIntervalCreation() {
        const maxX = Math.max(...this.listWalls.map((wall) => wall.pos.x + wall.w))
        if (maxX < window.innerWidth - this.intervalCreation) {
            if (this.listWalls.length - 1 < this.countWalls) {
                this.createWall()
            }
        }
    }

    render() {
        if (typeof this.startSlowDownWalls === 'number') {
            if (performance.now() - this.startSlowDownWalls > this.slowdownDuration) {
                this.speed = this.originSpeed
                this.listWalls.forEach((wall) => {
                    wall.speed = this.speed
                })

                this.startSlowDownWalls = null
            }
        }

        this.startIntervalCreation()

        this.checkCollision()
    }

    checkCollision() {
        if (!this.userSquare.collisionEnabled) return

        const listPositions = []
        this.listWalls.forEach((wall) => {
            listPositions.push(
                {
                    x: { start: wall.pos.x, end: wall.pos.x + wall.w },
                    y: wall.hole,
                }
            )
        })

        listPositions.find((pos) => {
            const userXStart = this.userSquare.pos.x
            const userXEnd = this.userSquare.pos.x + this.userSquare.w
            const userY = this.userSquare.pos.y

            if (userXEnd >= pos.x.start && userXStart <= pos.x.end && !pos.y.includes(userY)) {
                this.userSquare.collision()
            }
        })
    }

    init() {
        this.createWall()
        this.startIntervalCreation()
        this.handleMove()

        this.renderManager.add({
            priority: 0,
            renderFunction: this.render,
        })
    }
}