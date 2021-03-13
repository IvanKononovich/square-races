
const MAX_SPEED = 25
const MAX_COUNT_WALLS = 10
const MIN_SLOWDOWN_DURATION = 250
const MIN_COUNT_WALL_HOLE = 1
const COUNT_FOR_UP_LVL = 1

class WallManager {
    constructor({ ctx, renderManager, userSquare }) {
        this.ctx = ctx
        this.renderManager = renderManager
        this.userSquare = userSquare
        this.listWalls = []
        this.countWalls = 1
        this.intervalCreation = window.innerWidth / 2
        this.originSpeed = 3
        this.speed = this.originSpeed
        this.countWallHole = window.innerHeight / userSquare.h - 1
        this.wallSize = { w: Math.floor(window.innerWidth / COUNT_CELLS), h: window.innerHeight }
        this.render = this.render.bind(this)
        this.slowdownDuration = 500
        this.lvl = 1

        this.init()
    }

    levelUp() {
        this.intervalCreation = Math.max(this.intervalCreation / 1.06, this.userSquare.w * 4)
        if (this.lvl % 2 === 0) {
            this.originSpeed = Math.min(this.originSpeed + 1, MAX_SPEED)
            this.speed = this.originSpeed
        }
        this.slowdownDuration = Math.max(this.slowdownDuration - 25, MIN_SLOWDOWN_DURATION)
        this.countWallHole = Math.max(this.countWallHole - 1, MIN_COUNT_WALL_HOLE)
        this.countWalls = Math.min(this.countWalls + 1, MAX_COUNT_WALLS)

        console.log("# levelUp", this.lvl)
        console.log('# this.intervalCreation', this.intervalCreation)
        console.log('# this.originSpeed', this.originSpeed)
        console.log('# this.speed', this.speed)
        console.log('# this.slowdownDuration', this.slowdownDuration)
        console.log('# this.countWallHole', this.countWallHole)
        console.log('# this.countWalls', this.countWalls)
        console.log('# this.wallSize', this.wallSize.w)

        this.lvl += 1;
        this.syncWalls()
    }

    syncWalls() {
        this.listWalls.forEach((wall) => {
            wall.speed = this.speed
            wall.w = this.wallSize.w
            wall.countWallHole = this.countWallHole
        })
    }

    slowDownWalls(speed = 1) {
        this.listWalls.forEach((wall) => {
            wall.speed = speed
        })
        this.startSlowDownWalls = performance.now()
    }

    createWall() {
        const { ctx, renderManager, userSquare } = this
        const wall = new Wall({ ctx, renderManager, wallManager: this, userSquare })
        this.listWalls.push(wall)

        this.syncWalls()
        
        this.renderManager.add({
            priority: wall.renderPriority,
            renderFunction: wall.render,
        }, wall.renderId)
    }

    checkForFreeSpaceForWallSpawn() {
        const maxX = Math.max(...this.listWalls.map((wall) => wall.pos.x + wall.w))
        if (maxX < window.innerWidth - this.intervalCreation) {
            return true
        }
    }

    startIntervalCreation() {
        if (this.checkForFreeSpaceForWallSpawn() && this.listWalls.length - 1 < this.countWalls) {
            this.createWall()
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
                    prev: {...wall.pos.prev},
                    x: { start: wall.pos.x, end: wall.pos.x + wall.w },
                    y: wall.hole,
                    id: wall.id,
                    w: wall.w,
                }
            )
        })

        listPositions.find((pos) => {
            const userPrev = this.userSquare.pos.prev
            const userXStart = this.userSquare.pos.x
            const userXEnd = this.userSquare.pos.x + this.userSquare.w
            const userY = this.userSquare.pos.y

            if (userXEnd >= pos.x.start && userXStart <= pos.x.end) {
                if (!pos.y.includes(userY)) {
                    this.userSquare.collision()
                    this.userSquare.removeScore(pos.id)
                } else {
                    this.slowDownWalls(Math.min(Math.ceil(this.speed / 2), 5))
                }
            } 
            if (userXStart > pos.x.end && pos.y.includes(userY)) {
                if (userPrev.x + this.userSquare.w >= pos.prev.x && userPrev.x <= pos.prev.x + pos.w){
                    this.userSquare.addScore(pos.id)
                    if ((COUNT_FOR_UP_LVL * this.lvl - this.userSquare.score.size) <= 0) {
                        this.levelUp()
                    }
                    this.slowDownWalls(this.speed)
                }
            }
        })
    }

    init() {
        this.createWall()
        
        this.renderManager.add({
            priority: 0,
            renderFunction: this.render,
        })
    }
}