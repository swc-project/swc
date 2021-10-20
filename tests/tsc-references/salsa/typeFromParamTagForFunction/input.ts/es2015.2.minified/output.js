exports.A = function() {
    this.x = 1;
};
const { A  } = require("./a-ext");
exports.B = class {
    constructor(){
        this.x = 1;
    }
};
const { B  } = require("./b-ext");
export function C() {
    this.x = 1;
}
const { C  } = require("./c-ext");
export var D = function() {
    this.x = 1;
};
const { D  } = require("./d-ext");
export class E {
    constructor(){
        this.x = 1;
    }
}
const { E  } = require("./e-ext");
