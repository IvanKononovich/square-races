class Wall extends DynamicObject {
    constructor(props) {
        super(props)

        this.w = Math.floor(window.innerWidth / COUNT_CELLS)
        this.h = window.innerHeight
        this.startPos = {
            prev: {
                x: window.innerWidth,
                y: 0,
            },
            clearPos: {
                x: window.innerWidth,
                y: 0,
            },
            x: window.innerWidth,
            y: 0,
        }
        this.pos = { ...this.startPos }
        this.style = 'rgb(102, 0, 51)'
        this.isPixelMove = true
        this.withoutBorders = true
    }

    init() {
        super.init()
        this.id = Math.random() * Math.random() * Math.random()
        this.hole = []

        this.generateHole()
    }

    generateHole() {
        const allPos = [0]
        let generatePos = true

        while (generatePos) {
            const newPos = allPos[allPos.length - 1] + this.userSquare.h

            if (newPos < window.innerHeight) {
                allPos.push(newPos)
            } else {
                generatePos = false
            }
        }

        this.hole = []
        let generateHole = true
        while(generateHole) {
            this.hole = [...this.hole, allPos[Math.floor(this.getRandomArbitrary(0, allPos.length - 1))]]
            if (this.hole.length > this.wallManager.countWallHole) {
                generateHole = false
            }
        }
    }

    startNewCycle() {
        if (this.wallManager.checkForFreeSpaceForWallSpawn()) {
            this.generateHole()
            this.pos = { ...this.startPos }
            this.id = Math.random() * Math.random() * Math.random()
        }
    }

    checkCrossingBorder() {
        const { x, y } = this.pos

        if (x + this.w < 0) this.startNewCycle()
        if (x > window.innerWidth) this.startNewCycle()
        if (y + this.h < 0) this.startNewCycle()
        if (y > window.innerHeight) this.startNewCycle()
    }

    render() {
        if (this.pos.x + this.w > 0) {
            this.move({ x: this.speed * -1 })
        }
        this.checkCrossingBorder()

        super.render()

        this.hole.forEach(hole => {
            ctx.clearRect(this.pos.x, hole, this.w, this.userSquare.h);
        });
    }

}
