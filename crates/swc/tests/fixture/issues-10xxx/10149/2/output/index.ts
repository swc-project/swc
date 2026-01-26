import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
var foo = {
    bar (_0) {
        return _async_to_generator(function*({ name }) {
            console.log("arguments.length", arguments.length);
        }).apply(this, arguments);
    }
};
class Foo {
    bar(_0) {
        return _async_to_generator(function*({ name }) {
            console.log("arguments.length", arguments.length);
        }).apply(this, arguments);
    }
}
function bar(_0) {
    return _async_to_generator(function*({ name }) {
        console.log("arguments.length", arguments.length);
    }).apply(this, arguments);
}
