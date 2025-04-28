var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var foo = {
    bar (_0) {
        return _async_to_generator._(function*({ name }) {
            console.log("arguments.length", arguments.length);
        }).apply(this, arguments);
    }
};
class Foo {
    bar(_0) {
        return _async_to_generator._(function*({ name }) {
            console.log("arguments.length", arguments.length);
        }).apply(this, arguments);
    }
}
function bar(_0) {
    return _async_to_generator._(function*({ name }) {
        console.log("arguments.length", arguments.length);
    }).apply(this, arguments);
}
