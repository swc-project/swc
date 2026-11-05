var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 1] = "A";
    return E;
}(E || {});
(function(E) {
    E[E["B"] = 2] = "B";
})(E);
(function(N) {
    (function(E) {
        E["A"] = "a";
    })(N.E || (N.E = {}));
})(N || (N = {}));
(function(N) {
    (function(E) {
        E["B"] = "b";
    })(N.E || (N.E = {}));
})(N || (N = {}));
class Box {
    value;
    constructor(value = (()=>{
        let Local = /*#__PURE__*/ function(Local) {
            Local[Local["A"] = 3] = "A";
            return Local;
        }({});
        (function(Local) {
            Local[Local["B"] = 4] = "B";
        })(Local);
        return [
            Reflect.get(Local, "A"),
            Reflect.get(Local, "B")
        ];
    })()){
        this.value = value;
    }
}
console.log(Reflect.get(E, "A"), Reflect.get(E, "B"));
console.log(Reflect.get(N.E, "A"), Reflect.get(N.E, "B"));
console.log(new Box().value);
var N;
