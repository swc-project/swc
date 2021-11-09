// Parameter properties are not valid in overloads of constructors
class C {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class C2 {
    constructor(x1){
        this.x = x1;
    }
}
class C3 {
    constructor(y1){
        this.y = y1;
    }
}
var a;
var b;
