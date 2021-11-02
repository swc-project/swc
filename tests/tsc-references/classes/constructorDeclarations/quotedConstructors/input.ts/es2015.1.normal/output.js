class C {
    constructor(){
        console.log(this);
    }
}
class D {
    constructor(){
        console.log(this);
    }
}
var tmp = 'constructor';
class E {
    [tmp]() {
        console.log(this);
    }
}
new class _class {
    constructor(){
        console.log(this);
    }
};
var o = {
    "constructor" () {
    }
};
class F {
    constructor(){
        console.log(this);
    }
}
