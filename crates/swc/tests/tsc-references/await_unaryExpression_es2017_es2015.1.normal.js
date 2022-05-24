import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function bar() {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = // @target: es2017
    _async_to_generator(function*() {
        !(yield 42); // OK
    });
    return _bar.apply(this, arguments);
}
function bar1() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = _async_to_generator(function*() {
        +(yield 42); // OK
    });
    return _bar1.apply(this, arguments);
}
function bar3() {
    return _bar3.apply(this, arguments);
}
function _bar3() {
    _bar3 = _async_to_generator(function*() {
        -(yield 42); // OK
    });
    return _bar3.apply(this, arguments);
}
function bar4() {
    return _bar4.apply(this, arguments);
}
function _bar4() {
    _bar4 = _async_to_generator(function*() {
        ~(yield 42); // OK
    });
    return _bar4.apply(this, arguments);
}
