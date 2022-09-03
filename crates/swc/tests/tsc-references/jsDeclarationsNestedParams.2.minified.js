//// [file.js]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class X {
    cancel({ reason , code  }) {
        return _async_to_generator(function*() {})();
    }
}
class Y {
    cancel({ reason , suberr  }) {
        return _async_to_generator(function*() {})();
    }
}
