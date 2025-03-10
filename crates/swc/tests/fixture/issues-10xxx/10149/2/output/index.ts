var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var foo = {
    bar ({ name }) {
        var _arguments = arguments;
        return _async_to_generator._(function*() {
            console.log("arguments.length", _arguments.length);
        })();
    }
};
class Foo {
    bar({ name }) {
        var _arguments = arguments;
        return _async_to_generator._(function*() {
            console.log("arguments.length", _arguments.length);
        })();
    }
}
function bar(_) {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = _async_to_generator._(function*({ name }) {
        console.log("arguments.length", arguments.length);
    });
    return _bar.apply(this, arguments);
}
