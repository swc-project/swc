// Parameter properties are only valid in constructor definitions, not even in other forms of construct signatures
class C {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class C2 {
    constructor(x){
        this.x = x;
    }
}
class C3 {
    constructor(x){
        this.x = x;
    }
}
var a;
var b;
