// Parameter properties are not valid in overloads of constructors
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
    constructor(y){
        this.y = y;
    }
}
var a;
var b;
