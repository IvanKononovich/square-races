const canvas = document.getElementById('main-canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const renderManager = new RenderManager()
const userSquare = new UserSquare({ ctx, renderManager })
const wallManager = new WallManager({ ctx, renderManager, userSquare })

