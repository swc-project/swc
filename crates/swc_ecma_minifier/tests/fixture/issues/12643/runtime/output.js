let installed, late, counter;
console.log(1);
const run = (value)=>installed ? installed(value) : value;
console.log(run(2)), installed = (value)=>10 * value, console.log(run(2)), console.log(late), console.log(3);
for(let i = 0; i < 2; i++)console.log("undefined", "undefined");
console.log(counter++, counter), console.log("no hook"), console.log(4), console.log(!0, !1), console.log(4, 4, void 0), console.log(void 0), console.log(!1, !0), console.log((0, ({
    method () {
        "use strict";
        return void 0 === this;
    }
}).method)());
