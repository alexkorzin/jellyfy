export default class Ball {
    constructor(x, y, radius, color,speed) {
        // Look
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius || 5;

        // Phys
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.1;
        this.springForce = 0.9;

        this.originalX = x || 0;
        this.originalY = y || 0;

        this.speed = speed;
    }

    updatePosition(x, y) {
        this.y = y;
        this.x = x;
    }

    updateVars(settingsObj){
        this.friction = settingsObj.friction;
        this.springForce = settingsObj.spring;
    }

    phys(mouse, balls) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius + this.radius) {
            let angle = Math.atan2(dy, dx);
            let tx = mouse.x + Math.cos(angle) * (mouse.radius + this.radius);
            let ty = mouse.y + Math.sin(angle) * (mouse.radius + this.radius);

            this.vx += tx - this.x;
            this.vy += ty - this.y;
        }

        // Friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Final velocity
        this.x += this.vx;
        this.y += this.vy;

        balls.forEach((ball, i)=>{
            ball.x += this.vx*0.05;
            ball.y += this.vy*0.05;
        })
    }

    spring() {
        let dx1 = this.x - this.originalX;
        let dy1 = this.y - this.originalY;
        this.vx += -(dx1 * this.springForce);
        this.vy += -(dy1 * this.springForce);
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color || 'green';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}