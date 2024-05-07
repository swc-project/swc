var _define_property = require("@swc/helpers/_/_define_property");
let _ref = `lit${"lit"}`, _ref1 = `tpl${`tpl`}`, _ref2 = `lit${1 + 1}`, _ref3 = `complex${"123".length()}`;
class Foo {
    constructor(){
        _define_property._(this, 1, 2);
        _define_property._(this, "3", 4);
        _define_property._(this, `5`, 6);
        _define_property._(this, _ref, "lit");
        _define_property._(this, _ref1, `tpl`);
        _define_property._(this, _ref2, `lit`);
        _define_property._(this, _ref3, `complex`);
    }
}
