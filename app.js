import { borderCheck, circleRect, dist } from "./utils.js";

let daycnt = document.querySelector('.day');
let nightcount = document.querySelector('.night');
const dark = '#555555';
const light = '#eeeedd';
const objectWidth = 25;
const canvasWidth = 500;

daycnt.innerHTML = objectWidth;
nightcount.innerHTML = objectWidth;

var darkC, lightC, board;

function startGame() {
    myGameArea.start();
    board = new Board(20,20);
    darkC = new circle(objectWidth, objectWidth, dark, 10, 400);
    lightC = new circle(objectWidth, objectWidth, light, 400, 120);
}

var myGameArea = {
    canvas : document.querySelector(".canvas"),
    start : function() {
      this.context = this.canvas.getContext("2d");
      this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class component {
    update() {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = myGameArea.context;
    }
}

class Board {
    squareM = []
    #initMatrix() {
        for (let i = 0; i < this.height; i ++) {
            this.squareM[i] = []
            for (let j = 0; j < this.width; j ++)
                if (j < this.width / 2) 
                    this.squareM[i][j] = new component(objectWidth, objectWidth, light, j * objectWidth, i * objectWidth);
                else this.squareM[i][j] = new component(objectWidth, objectWidth, dark, j * objectWidth, i * objectWidth);
        }
    }
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.#initMatrix();
    }

    update() {
        let dcnt = 0;
        for (let i = 0; i < this.height; i ++)
            for (let j = 0; j < this.width; j ++) {
                this.squareM[i][j].update();
                if (this.squareM[i][j].color === light) dcnt ++;
            }
        daycnt.innerHTML = dcnt;
        nightcount.innerHTML = (canvasWidth/objectWidth)**2 - dcnt;
    }
}

class circle extends component {
    r = this.width / 2;
    vx = (Math.random() + 5) * (Math.random() > 0.5 ? 1 : -1);
    vy = (Math.random() + 5) * (Math.random() > 0.5 ? 1 : -1);
    speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    checkCollision() {
        let [mx, my] = borderCheck(this.x,this.y,this.r,canvasWidth,canvasWidth);
        if (mx + my < 2) {
            this.vx *= mx;
            this.vy *= my;
            return null;
        }
        for (let i = -1; i <= 1; i++ )
            for (let j = -1; j <= 1; j ++) {
                let sx = this.x + this.r + i * objectWidth, sy = this.y + this.r + j * objectWidth;
                if (sx < 0 || sx >canvasWidth || sy < 0 || sy >canvasWidth) continue;
                sx -= (sx % objectWidth);sy -= (sy % objectWidth);
                let [vx, vy, hit] = circleRect(this.x + this.r, this.y + this.r, this.r, sx, sy, objectWidth, objectWidth, this.vx, this.vy);
                if (hit && board.squareM[sy / objectWidth][sx / objectWidth].color === this.color) {
                    if (dist(darkC.x,darkC.y,lightC.x,lightC.y) > 2*this.width)
                        board.squareM[sy / objectWidth][sx / objectWidth].color = (this.color === dark ? light : dark);
                    this.vx = vx; this.vy = vy;
                    break;
                }
            }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        let ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


function updateGameArea() {
    myGameArea.clear();
    darkC.checkCollision();
    lightC.checkCollision();
    board.update();
    darkC.update();
    lightC.update();
}

startGame();