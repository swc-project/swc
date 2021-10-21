// Parameter properties are only valid in constructor definitions, not even in other forms of construct signatures
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
    constructor(x2){
        this.x = x2;
    }
}
var a;
var b;
