var _define_property = require("@swc/helpers/_/_define_property");
class Foo {
    constructor(){
        _define_property._(this, "static", 5);
        _define_property._(this, "declare", 5);
    }
}
