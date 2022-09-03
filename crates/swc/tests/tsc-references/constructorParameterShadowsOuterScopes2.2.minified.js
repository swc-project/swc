//// [constructorParameterShadowsOuterScopes2.ts]
var x = 1;
class C {
    b = x;
    constructor(x){}
}
var y = 1;
class D {
    b = y;
    constructor(x){
        var y = "";
    }
}
class E {
    b = z;
    constructor(z1){}
}
