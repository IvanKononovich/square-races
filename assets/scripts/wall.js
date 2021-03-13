class Wall extends DynamicObject {
    constructor(props) {
        super(props)

        this.w = Math.floor(window.innerWidth / 60)
        this.h = window.innerHeight
        this.startPos = {
            prev: {
                x: window.innerWidth,
                y: 0,
            },
            x: window.innerWidth,
            y: 0,
        }
        this.pos = { ...this.startPos }
        this.style = 'rgb(102, 0, 51)'
        this.speed = 5
        this.isPixelMove = true
        this.withoutBorders = true
    }

    init() {
        super.init()
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


        // TODO: transfer control count hole to the wall manager
        for (let index = 0; index < Math.max(Math.floor(this.getRandomArbitrary(0, 5)), 1); index++) {
            this.hole = [...this.hole, allPos[Math.floor(this.getRandomArbitrary(0, allPos.length - 1))]]
        }
    }

    startNewCycle() {
        this.pos = { ...this.startPos }
    }

    checkCrossingBorder() {
        const { x, y } = this.pos

        if (x + this.w < 0) this.startNewCycle()
        if (x > window.innerWidth) this.startNewCycle()
        if (y + this.h < 0) this.startNewCycle()
        if (y > window.innerHeight) this.startNewCycle()
    }

    render() {
        this.move({ x: this.speed * -1 })
        this.checkCrossingBorder()

        super.render()

        this.hole.forEach(hole => {
            ctx.clearRect(this.pos.x, hole, this.w, this.userSquare.h);
        });
    }

}
