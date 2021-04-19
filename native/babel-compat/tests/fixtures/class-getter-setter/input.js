class Rectangle {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    set height(height) { this.height = height; }

    set width(width) { this.width = width; }

    get area() {
        return this.calcArea();
    }

    calcArea() {
        return this.height * this.width;
    }
}

const square = new Rectangle(10, 10);

console.log(square.area);
