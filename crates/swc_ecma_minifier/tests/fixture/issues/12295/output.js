console.log(({
    x: 42,
    m () {
        return eval("this.x");
    }
}).m()), console.log(({
    x: 42,
    m () {
        return eval("this.x");
    }
}).m()), console.log(({
    m () {
        return eval("arguments[0]");
    }
}).m(42)), console.log(({
    m: ()=>function() {
            return eval("arguments[0]");
        }
}).m()(42)), console.log((()=>class {
        static x = eval("1");
    })().x), console.log(({
    x: 42,
    m () {
        return this.x;
    }
}).m());
const literal = {
    m: ()=>1
};
console.log(literal.m());
