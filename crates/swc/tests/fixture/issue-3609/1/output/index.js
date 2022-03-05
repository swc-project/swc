import * as swcHelpers from "@swc/helpers";
let _ref = `lit${"lit"}`, _ref1 = `tpl${`tpl`}`, _ref2 = `lit${1 + 1}`, _ref3 = `complex${"123".length()}`;
class Foo {
    constructor(){
        swcHelpers.defineProperty(this, 1, 2);
        swcHelpers.defineProperty(this, "3", 4);
        swcHelpers.defineProperty(this, `5`, 6);
        swcHelpers.defineProperty(this, _ref, "lit");
        swcHelpers.defineProperty(this, _ref1, `tpl`);
        swcHelpers.defineProperty(this, _ref2, `lit`);
        swcHelpers.defineProperty(this, _ref3, `complex`);
    }
}
