class C {
    constructor(x = 1){
        this.x = x;
        var y = x;
    }
}
class D {
    constructor(x = 1, y = x){
        this.y = y;
        var z = x;
    }
}
class E {
    constructor(x = new Date()){
        var y = x;
    }
}
