class C {
    constructor(x = 1){
        this.x = x;
        var y = x;
    }
}
class D {
    constructor(x1 = 1, y = x1){
        this.y = y;
        var z = x1;
    }
}
class E {
    constructor(x2 = new Date()){
        var y = x2;
    }
}
