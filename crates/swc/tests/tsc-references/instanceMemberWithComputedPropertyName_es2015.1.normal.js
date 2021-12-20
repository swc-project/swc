// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
var _key;
const x = 1;
class C {
    constructor(){
        this[_key] = true;
        const { a , b  } = {
            a: 1,
            b: 2
        };
    }
}
_key = x;
