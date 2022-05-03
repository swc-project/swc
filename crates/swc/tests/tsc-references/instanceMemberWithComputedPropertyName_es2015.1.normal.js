// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
const x = 1;
let _x = x;
class C {
    constructor(){
        this[_x] = true;
        const { a , b  } = {
            a: 1,
            b: 2
        };
    }
}
