export { };
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
import { Base } from "./base.js";
export class Argument extends Base {
    static parse(tokeniser) {}
    get type() {
        return "argument";
    }
    *validate(defs) {}
}
