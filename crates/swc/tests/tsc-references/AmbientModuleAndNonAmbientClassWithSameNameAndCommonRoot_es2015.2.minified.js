var A;
(A || (A = {})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
};
A.Point.Origin, new A.Point(0, 0);
