//// [propertyAccessOnTypeParameterWithConstraints.ts]
var i, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.f = function() {
        var x;
        return x.getDate() + x.getDate();
    }, C;
}())().f(), i.foo.getDate(), i.foo.getDate(), a().getDate(), a().getDate(), ({
    foo: function(x) {
        return x.getDate() + x.getDate();
    }
}).foo(new Date());
