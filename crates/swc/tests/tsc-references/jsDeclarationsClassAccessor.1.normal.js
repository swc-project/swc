//// [supplement.d.ts]
export { };
//// [base.js]
export class Base {
    toJSON() {
        const json = {
            type: undefined,
            name: undefined,
            inheritance: undefined
        };
        return json;
    }
    constructor(){}
}
//// [argument.js]
import { Base } from "./base.js";
export class Argument extends Base {
    /**
     * @param {*} tokeniser
     */ static parse(tokeniser) {
        return;
    }
    get type() {
        return "argument";
    }
    /**
     * @param {*} defs
     */ *validate(defs) {}
}
