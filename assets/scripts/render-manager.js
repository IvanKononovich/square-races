class RenderManager {
    constructor() {
        this.listElement = {}

        this.render = this.render.bind(this)

        this.init()
    }

    remove(id) {
        delete this.listElement[id]
    }

    add(config, id = Math.random() * Math.random() * Math.random()) {
        this.listElement[id] = config
    }

    render() {
        const queue = Object.keys(this.listElement).map((key) => {
            return this.listElement[key]
        }).sort((a, b) => {
            return a.priority - b.priority
        })

        queue.forEach(({ renderFunction }) => {
            renderFunction()
        })

        requestAnimationFrame(this.render)
    }

    init() {
        this.render()
    }
}