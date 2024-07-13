console.log((o = {
    foo: ()=>val,
    s: "test"
}).foo().length), console.log((o = {
    foo (val1 = this.s) {
        return val1;
    },
    s: "test"
}).foo().length);
