// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
const x = 1;
class C {
    constructor(){
        this[x] = true;
        const { a , b  } = {
            a: 1,
            b: 2
        };
    }
}
