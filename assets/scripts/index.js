const canvas = document.getElementById('main-canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

const userSquare = new UserSquare({ ctx })
