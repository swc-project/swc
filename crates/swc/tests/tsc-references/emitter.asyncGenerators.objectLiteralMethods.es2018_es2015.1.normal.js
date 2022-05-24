import _async_generator_delegate from "@swc/helpers/lib/_async_generator_delegate.js";
import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
// @target: es2018
// @lib: esnext
// @filename: O1.ts
const o1 = {
    f () {
        return _wrap_async_generator(function*() {})();
    }
};
// @filename: O2.ts
const o2 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield;
        })();
    }
};
// @filename: O3.ts
const o3 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield 1;
        })();
    }
};
// @filename: O4.ts
const o4 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield* _async_generator_delegate(_async_iterator([
                1
            ]), _await_async_generator);
        })();
    }
};
// @filename: O5.ts
const o5 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
                yield 1;
            })()), _await_async_generator);
        })();
    }
};
// @filename: O6.ts
const o6 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield _await_async_generator(1);
        })();
    }
};
// @filename: O7.ts
const o7 = {
    f () {
        return _wrap_async_generator(function*() {
            return 1;
        })();
    }
};
