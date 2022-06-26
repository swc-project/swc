// @strict: true
// @allowUnreachableCode: false
// @declaration: true
function f1(x) {
    if (!!true) {
        switch(x){
            case 1:
                return "a";
            case 2:
                return "b";
        }
        x; // Unreachable
    } else {
        throw 0;
    }
}
function f2(x) {
    var z;
    switch(x){
        case 1:
            z = 10;
            break;
        case 2:
            z = 20;
            break;
    }
    z; // Definitely assigned
}
function f3(x) {
    switch(x){
        case 1:
            return 10;
        case 2:
            return 20;
        // Default considered reachable to allow defensive coding
        default:
            throw new Error("Bad input");
    }
}
var // Repro from #11572
E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
})(E || (E = {}));
function f(e) {
    switch(e){
        case E.A:
            return 0;
        case E.B:
            return 1;
    }
}
function g(e) {
    if (!true) return -1;
    else switch(e){
        case E.A:
            return 0;
        case E.B:
            return 1;
    }
}
function area(s) {
    var area;
    switch(s.kind){
        case "square":
            area = s.size * s.size;
            break;
        case "rectangle":
            area = s.width * s.height;
            break;
        case "circle":
            area = Math.PI * s.radius * s.radius;
            break;
        case "triangle":
            area = Math.sqrt(3) / 4 * s.side * s.side;
            break;
    }
    return area;
}
function areaWrapped(s) {
    var area;
    area = function() {
        switch(s.kind){
            case "square":
                return s.size * s.size;
            case "rectangle":
                return s.width * s.height;
            case "circle":
                return Math.PI * s.radius * s.radius;
            case "triangle":
                return Math.sqrt(3) / 4 * s.side * s.side;
        }
    }();
    return area;
}
var // Repro from #13241
MyEnum;
(function(MyEnum) {
    MyEnum[MyEnum["A"] = 0] = "A";
    MyEnum[MyEnum["B"] = 1] = "B";
})(MyEnum || (MyEnum = {}));
function thisGivesError(e) {
    var s;
    switch(e){
        case MyEnum.A:
            s = "it was A";
            break;
        case MyEnum.B:
            s = "it was B";
            break;
    }
    return s;
}
function good1(e) {
    var s;
    switch(e){
        case MyEnum.A:
            s = "it was A";
            break;
        case MyEnum.B:
            s = "it was B";
            break;
        default:
            s = "it was something else";
            break;
    }
    return s;
}
function good2(e) {
    switch(e){
        case MyEnum.A:
            return "it was A";
        case MyEnum.B:
            return "it was B";
    }
}
var // Repro from #18362
Level;
(function(Level) {
    Level[Level["One"] = 0] = "One";
    Level[Level["Two"] = 1] = "Two";
})(Level || (Level = {}));
var doSomethingWithLevel = function(level) {
    var next;
    switch(level){
        case Level.One:
            next = Level.Two;
            break;
        case Level.Two:
            next = Level.One;
            break;
    }
    return next;
};
function withDefault(s1, s2) {
    switch(s1.kind){
        case "square":
            return "1";
        case "circle":
            switch(s2.kind){
                case "square":
                    return "2";
                case "circle":
                    return "3";
                default:
                    return "never";
            }
    }
}
function withoutDefault(s1, s2) {
    switch(s1.kind){
        case "square":
            return "1";
        case "circle":
            switch(s2.kind){
                case "square":
                    return "2";
                case "circle":
                    return "3";
            }
    }
}
// Repro from #20823
function test4(value) {
    var x;
    switch(value){
        case 1:
            x = "one";
            break;
        case 2:
            x = "two";
            break;
    }
    return x;
}
var // Repro from #34661
Animal;
(function(Animal) {
    Animal[Animal["DOG"] = 0] = "DOG";
    Animal[Animal["CAT"] = 1] = "CAT";
})(Animal || (Animal = {}));
function expression() {
    var ref;
    switch((ref = zoo === null || zoo === void 0 ? void 0 : zoo.animal) !== null && ref !== void 0 ? ref : Animal.DOG){
        case Animal.DOG:
            return Animal.DOG;
        case Animal.CAT:
            return Animal.CAT;
    }
}
// Repro from #34840
function foo() {
    var foo = 0;
    while(true){
        var stats = foo;
        switch(stats){
            case 1:
                break;
            case 2:
                break;
        }
    }
}
function ff(o, k) {
    switch(k){
        case "c":
            k = "a";
    }
    k === "c"; // Error
    return o[k];
}
function f35431(a) {
    switch(a.kind){
        case "abc":
        case "def":
            return;
        default:
            a.kind; // Error expected
    }
}
