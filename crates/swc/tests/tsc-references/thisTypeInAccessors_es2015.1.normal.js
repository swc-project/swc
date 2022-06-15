const explicit = {
    n: 12,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
};
const copiedFromGetter = {
    n: 14,
    get x () {
        return this.n;
    },
    set x (n){
        this.n = n;
    }
};
const copiedFromSetter = {
    n: 15,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
};
const copiedFromGetterUnannotated = {
    n: 16,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
};
class Explicit {
    get x() {
        return this.n;
    }
    set x(n1) {
        this.n = n1;
    }
    constructor(){
        this.n = 17;
    }
}
class Contextual {
    get x() {
        return this.n;
    }
    constructor(){
        this.n = 21;
    }
}
