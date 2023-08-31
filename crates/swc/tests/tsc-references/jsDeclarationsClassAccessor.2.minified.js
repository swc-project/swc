//// [supplement.d.ts]
export { };
//// [base.js]
export class Base {
    toJSON() {
        return {
            type: void 0,
            name: void 0,
            inheritance: void 0
        };
    }
    constructor(){}
}
//// [argument.js]
import { Base } from "./base.js";
export class Argument extends Base {
    /**
     * @param {*} tokeniser
     */ static parse(tokeniser) {}
    get type() {
        return "argument";
    }
    /**
     * @param {*} defs
     */ *validate(defs) {}
}
