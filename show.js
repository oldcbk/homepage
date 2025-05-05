let squaresContainer;
let mgr;
onload = function () {
    squaresContainer = document.getElementById("squaresContainer");
    mgr = new fallingSquareManager();
    requestAnimationFrame(update);
}

function update() {
    mgr.update();
    requestAnimationFrame(update);
}

function squareID(id) {
    return `square_${id}`;
}

class fallingSquare {
    id; // number
    element; //
    manager;
    edgeLen; // px
    width; // 计算出来的方形最宽的宽度
    fallingPerFrame; // px
    rotatePerFrame; // deg
    xPos; // px
    yPos; // px
    phase; // deg

    constructor(id, manager, edgeLen, fallingPerFrame, rotatePerFrame) {
        this.id = id;
        this.element = document.getElementById(squareID(id));
        this.manager = manager;
        this.edgeLen = edgeLen;
        this.element.style.width = `${edgeLen}px`;
        this.element.style.height = `${edgeLen}px`;
        this.width = this.edgeLen * Math.sqrt(2);
        this.fallingPerFrame = fallingPerFrame;
        this.rotatePerFrame = rotatePerFrame;
    }

    start(xPos) {
        this.xPos = xPos;
        this.yPos = -this.width;
        this.phase = randBetween(0, 90);
        this.element.style.left = `${xPos}px`;
    }

    update(maxY) {
        if (this.yPos - this.width < maxY) {
            this.yPos += this.fallingPerFrame;
            this.phase = (this.phase + this.rotatePerFrame) % 360;
            this.element.style.top = `${this.yPos}px`;
            this.element.style.transform = `rotate(${this.phase}deg)`;
        } else {
            this.end();
        }
    }

    end() {
        this.manager.remove(this.id);
    }
}

class fallingSquareManager {
    arrayLength = 34;
    squares = new Array(this.arrayLength);
    generateCD = 5;

    // 先把DOM生成好
    constructor() {
        for (let i = 0; i < this.arrayLength; i++) {
            let square = document.createElement("div");
            square.id = squareID(i);
            square.style.position = "absolute";
            square.style.backgroundColor = "lightgreen";
            squaresContainer.appendChild(square);
        }
    }

    generate(amount) {
        this.generateCD = randBetween(5, 20);
        let index;
        while (amount > 0) {
            index = Math.trunc(Math.random() * this.arrayLength);
            if (this.squares[index] == null || this.squares[index] === undefined) {
                this.squares[index] = new fallingSquare(index,
                    this,
                    randBetween(30, 100),
                    randBetween(1, 10),
                    randBetween(0.4, 2));
                this.squares[index].start(randBetween(0, window.innerWidth));
            }
            --amount;
        }
    }

    update() {
        if (this.generateCD > 0) {
            --this.generateCD;
        } else {
            this.generate(Math.trunc(Math.random() * 2));
        }
        for (let square of this.squares) {
            if (square == null) continue;
            square.update(window.innerHeight);
        }
    }

    remove(id) {
        this.squares[id] = null;
    }
}

function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}