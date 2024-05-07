var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
class MyClass {
}
_ts_decorate._([
    MyDecorator(MyClass),
    _ts_metadata._("design:type", String)
], MyClass.prototype, "prop", void 0);
console.log(new MyClass());
