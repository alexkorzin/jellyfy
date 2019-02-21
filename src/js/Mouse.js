export default class Mouse {
    constructor(canvas) {
        this.x = window.innerWidth / 2,
        this.y = -1000

        canvas.addEventListener('mousemove', (evt) => {
            let rect = canvas.getBoundingClientRect();
            this.x = evt.clientX - rect.left,
            this.y = evt.clientY - rect.top
        })
        canvas.addEventListener('mouseleave', (evt) => {
            this.x = window.innerWidth / 2,
            this.y = -1000
        })
    }
}