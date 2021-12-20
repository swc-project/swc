var anyCtor, anyCtor1, nestedCtor;
new class {
}, new class {
    constructor(n){
    }
}, new anyCtor, new anyCtor1(void 0), new function() {
}();
var nested = new new new nestedCtor()()();
new nested(), new nested();
