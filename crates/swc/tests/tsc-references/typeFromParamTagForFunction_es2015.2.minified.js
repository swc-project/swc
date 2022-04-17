exports.A = function() {
    this.x = 1;
};
let { A  } = require("./a-ext");
exports.B = class {
    constructor(){
        this.x = 1;
    }
};
let { B  } = require("./b-ext");
export function C() {
    this.x = 1;
}
let { C  } = require("./c-ext");
export var D = function() {
    this.x = 1;
};
let { D  } = require("./d-ext");
export class E {
    constructor(){
        this.x = 1;
    }
}
let { E  } = require("./e-ext");
