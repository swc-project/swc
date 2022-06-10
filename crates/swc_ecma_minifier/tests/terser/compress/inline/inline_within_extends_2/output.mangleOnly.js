class a extends b(c(Array)) {
    constructor(){
        super(...arguments);
    }
}
function b(a) {
    return class extends a {
        constructor(){
            super(...arguments);
        }
        second() {
            return this[1];
        }
    };
}
function c(a) {
    return class extends a {
        constructor(...a){
            super(...a);
        }
    };
}
console.log(new a(1, "PASS", 3).second());
