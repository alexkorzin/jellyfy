import Mouse from './Mouse'
import Ball from './Balls'
import SvgParse from './SvgParse'
import Perlin from './perlin'


class Jellyfy {
    constructor(obj) {
        // Constructor Args:

        // {
        //     canvas: --,
        //     canvasHeight: --,
        //     canvasWidth: --,
        //     shapes: --,
        //     mouseRadius: --,
        //     mouseColor: --,
        //     isFly: --,
        //     drawMouse: --,
        //     mouseEffect: --,
        //     customRAF: --,
        //     waves: --,
        //     waveForce: --,
        //     colorSettings: {
        //         color1: --,
        //         color2: --,
        //         distX: --,
        //         distY: --
        //     }
        //     strokeSettings: {
        //         color: --,
        //         width: --
        //     }   
        // }
        this.isFly = obj.isFly;
        this.customRAF = obj.customRAF || false;
        this.waves = true;
        if (obj.waves === false) {
            this.waves = false;
        }
        this.waveForce = obj.waveForce || 1.5;

        // Canvas setup
        this.canvas = document.querySelector(obj.canvas);
        this.canvas.height = obj.canvasHeight;
        this.canvas.width = obj.canvasWidth;
        if(this.canvas.height === window.innerHeight && this.canvas.width === window.innerWidth){
            this.fullScreen = true;
        }
        this.ctx = this.canvas.getContext('2d');


        // Mouse setup
        this.mouse = new Mouse(this.canvas);
        this.mouseStettings = {
            color: obj.mouseColor || 'rgba(0,0,0, 0.2)',
            radius: obj.mouseRadius || 100,
            drawMouse: obj.drawMouse || false,
            effect: obj.mouseEffect || false
        }
        this.mouseBall = new Ball(
            this.mouse.x,
            this.mouse.y,
            this.mouseStettings.radius,
            this.mouseStettings.color
        );


        // Color setup
        this.jellyColorSettings = {
            colorDark: obj.colorSettings.colorDark || "#ce3535",
            colorLight: obj.colorSettings.colorLight || "#f24443",
            distX: obj.colorSettings.distX || -30,
            distY: obj.colorSettings.distY || -100,
        }


        // Stroke setup
        this.stroke = obj.stroke || false;
        if (obj.strokeSettings) {
            this.strokeSettings = {
                width: obj.strokeSettings.width || 5,
                color: obj.strokeSettings.color || "red"
            }
        }


        this.OBJECTS = [];
        this.SHAPES = obj.shapes;


        // Get Objects from Shapes
        this.SHAPES.forEach(shape => {
            let object = {};
            object.color = shape.color;
            object.x = shape.x;
            object.y = shape.y;
            object.speed = shape.speed;
            object.dots = [];
            SvgParse(shape.shape, shape.dotsCount, shape.x, shape.y, shape.scale).forEach(dot => {
                object.dots.push(new Ball(dot[0], dot[1], 4, 'white', object.speed));
            });
            this.OBJECTS.push(object)
        })


        // Set the original X as start position 
        this.OBJECTS.forEach(obj => {
            obj.dots.forEach(dot => {
                dot.startX = dot.x;
            })
        })

        this.time = 0;


        // Run animation
        if (!this.customRAF) {
            this.Render();
        }

        window.addEventListener('resize', ()=> {
            if(this.fullScreen){
                this.canvas.height = window.innerHeight;
                this.canvas.width = window.innerWidth;    
            }
            


            
        })
    }

    generateGradient(x, y, colorSettings) {
        let grd = this.ctx.createLinearGradient(
            x,
            y + 50,
            x + colorSettings.distX,
            y + colorSettings.distY
        );
        grd.addColorStop(0, colorSettings.colorDark);
        grd.addColorStop(1, colorSettings.colorLight);
        return grd;
    }

    connectDots(object) {
        let dots = object.dots;
        this.ctx.save();
        this.ctx.beginPath();
        for (var i = 0, jlen = dots.length; i <= jlen; ++i) {
            var p0 = dots[i + 0 >= jlen ? i + 0 - jlen : i + 0];
            var p1 = dots[i + 1 >= jlen ? i + 1 - jlen : i + 1];
            this.ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
        }
        this.ctx.closePath();


        if (object.color) {
            this.ctx.fillStyle = object.color;
        }
        else {
            this.ctx.fillStyle = this.generateGradient(object.dots[0].x, object.dots[0].y, this.jellyColorSettings);
        }

        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 120;
        this.ctx.shadowOffsetY = 50;
        this.ctx.shadowOffsetX = 0;
        this.ctx.fill();

        if (this.strokeSettings) {
            this.ctx.strokeStyle = this.strokeSettings.color;
            this.ctx.lineWidth = this.strokeSettings.width;
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    Render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.mouseBall.updatePosition(this.mouse.x, this.mouse.y);
        this.time++;
        // Draw and animate every shape
        this.OBJECTS.forEach(object => {

            let zeroDots = 0;
            this.connectDots(object);
            object.dots.forEach((dot, i) => {

                if (this.isFly) {
                    // Objects move up
                    dot.y -= dot.speed;
                    dot.originalY -= dot.speed;
                    if (dot.y < -100) {
                        zeroDots++;
                    }
                    // Object reacts to the mouse move
                    if (this.mouseStettings.effect) {
                        dot.x += ((window.innerWidth / 2 - this.mouse.x) / window.innerWidth) / 2
                        dot.originalX += ((window.innerWidth / 2 - this.mouse.x) / window.innerWidth) / 2
                    }
                }

                // Apply physics
                dot.spring();
                dot.phys(this.mouseBall, object.dots);

                if (this.waves) {
                    dot.x += Perlin(0, this.time / 80 + i / 10, 0) * this.waveForce;
                    dot.y += Perlin(0, this.time / 80 + i / 10, 0) * this.waveForce;
                }

            });

            // If all dots of object leave the screen
            if (zeroDots === object.dots.length) {
                object.dots.forEach((dot, i) => {
                    // Set Y pos over the screen
                    dot.y += this.canvas.height + 800;
                    dot.originalY += this.canvas.height + 800;

                    // Set X pos to original
                    dot.x = dot.startX;
                    dot.originalX = dot.startX;
                })
            }
        });

        if (this.mouseStettings.drawMouse) {
            this.mouseBall.draw(this.ctx);
        }

        if (!this.customRAF) {
            requestAnimationFrame(this.Render.bind(this));
        }
    }
}

window.Jellyfy = Jellyfy;