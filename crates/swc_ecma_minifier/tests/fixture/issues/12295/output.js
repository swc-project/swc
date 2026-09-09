console.log(({
    x: 42,
    m () {
        return eval("this.x");
    }
}).m()), console.log(({
    m () {
        return eval("arguments[0]");
    }
}).m(42)), console.log(({
    x: 42,
    m () {
        return this.x;
    }
}).m());
const literal = {
    m: ()=>1
};
console.log(literal.m());
