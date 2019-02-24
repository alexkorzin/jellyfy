# jellyfy
Jellyfy is vanilla javascript library to create and animate jelly effect from any SVG shape.

# [Examples](http://alexkorzin.tk/jellyfy/exaple3.html)

# Getting Started
### 1. Include `jellyfy.js` in your project.
```javascript
import Jellyfy from './jellyfy'
```
or
```html
<script src="js/jellyfy.js"></script>
```
### 2. Pepare `SVG Path` and `Canvas element`.
Set `display: none` to your SVG and add `id` to the path. You can use multiple paths.
```html
<!-- Your SVG -->
<svg style="display: none">
    <path id="shape" d="m500 250c27.614 0 50 22.386 50 50s-22.386 50-50 50-50-22.386-50-50 22.386-50 50-50z"/>
</svg>

<!-- Canvas element -->
<canvas class="canvas"></canvas>
```
### 3. Setup your shapes
```javascript
//Push all your shapes into JS array
let shapes = [{
        shape: '#shape',                       // Path id from DOM
        x: 100,                                // Shape X offset
        y: 100,                                // Shape X offset
        scale: 18 + window.innerWidth / 220,   // Shape Scale
        dotsCount: 50,                         // Pivot Points
        speed: 0.4,                            // Flying Speed
        color: 'pink'                          // You can set color of each shape
    }, {
        shape: '#one_more_shape',
        x: window.innerWidth / 2 - 300,
        y: window.innerHeight / 2 + 800,
        scale: 30 + window.innerWidth / 220,
        dotsCount: 100,
        speed: 0.9,
    }]
```
### 4. Init `jellyfy.js`
```javascript
let jl = new Jellyfy({
        canvas: '.canvas',
        canvasHeight: window.innerHeight,
        canvasWidth: window.innerWidth,
        shapes: shapes,
        isFly: true,
        waves: true,
        waveForce: 1.3,
        drawMouse: false,
        mouseRadius: 100,
        mouseColor: "green",
        mouseEffect: true,
        customRAF: false,
        colorSettings: {
            colorDark: "#6b2cb3",
            colorLight: "#31b7ef",
            distX: 100,
            distY: 100
        },
        strokeSettings: {
            color: "red",
            width: 5
        }
    });
```
### 5. Settings
Property | Default | Description
--- | --- | ---
*canvas* | `undefined` | Canvas element selector
*canvasHeight / canvasWidth* | `undefined` | Canvas size `px`
*shapes* | `undefined` | JS Array of your shapes and settings
*isFly* | `false` | Makes your shapes fly from bottom to top of the screen infinitely repeat
*waves* | `true` | Makes your shapes randomly wavering
*waveForce* | `1.5` | How strong is wavering
*drawMouse* | `false` | Draw cirlce around cursor
*mouseEffect* | `true` | Mouse position effects to shapes fly direction
*customRAF* | `false` | Allows to use your rAF or GSAP for example
*colorSettings* | `undefined` | Gradient setup
*strokeSettings* | `undefined` | Add stroke to your shapes

### 6. Using custom rAF
```javascript
function draw(){
    jl.Render();
    requestAnimationFrame(draw)
}
draw();
```