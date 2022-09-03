//// [exhaustiveSwitchStatements1.ts]
function f1(x) {
    switch(x){
        case 1:
            return "a";
        case 2:
            return "b";
    }
}
function f2(x) {}
function f3(x) {
    switch(x){
        case 1:
            return 10;
        case 2:
            return 20;
        default:
            throw Error("Bad input");
    }
}
function f(e) {
    switch(e){
        case E.A:
            return 0;
        case E.B:
            return 1;
    }
}
function g(e) {
    switch(e){
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
    }
    return area;
}
function areaWrapped(s) {
    return function() {
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
}
function thisGivesError(e) {
    var s;
    switch(e){
        case MyEnum.A:
            s = "it was A";
            break;
        case MyEnum.B:
            s = "it was B";
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
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), function(MyEnum) {
    MyEnum[MyEnum.A = 0] = "A", MyEnum[MyEnum.B = 1] = "B";
}(MyEnum || (MyEnum = {})), function(Level) {
    Level[Level.One = 0] = "One", Level[Level.Two = 1] = "Two";
}(Level || (Level = {}));
var E, MyEnum, Level, Animal, doSomethingWithLevel = function(level) {
    var next;
    switch(level){
        case Level.One:
            next = Level.Two;
            break;
        case Level.Two:
            next = Level.One;
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
function test4(value) {
    var x;
    switch(value){
        case 1:
            x = "one";
            break;
        case 2:
            x = "two";
    }
    return x;
}
function expression() {
    var ref;
    switch(null !== (ref = null == zoo ? void 0 : zoo.animal) && void 0 !== ref ? ref : Animal.DOG){
        case Animal.DOG:
            return Animal.DOG;
        case Animal.CAT:
            return Animal.CAT;
    }
}
function foo() {
    for(;;);
}
function ff(o, k) {
    return "c" === k && (k = "a"), o[k];
}
function f35431(a) {
    switch(a.kind){
        case "abc":
        case "def":
            return;
        default:
            a.kind;
    }
}
!function(Animal) {
    Animal[Animal.DOG = 0] = "DOG", Animal[Animal.CAT = 1] = "CAT";
}(Animal || (Animal = {}));
