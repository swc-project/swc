class s extends n(e(Array)) {
    constructor(){
        super(...arguments);
    }
}
function n(s) {
    return class extends s {
        constructor(){
            super(...arguments);
        }
        second() {
            return this[1];
        }
    };
}
function e(s) {
    return class extends s {
        constructor(...s){
            super(...s);
        }
    };
}
console.log(new s(1, "PASS", 3).second());
