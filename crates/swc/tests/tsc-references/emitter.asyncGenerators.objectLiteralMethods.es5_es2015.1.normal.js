// @target: es5
// @lib: esnext
// @filename: O1.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
const o1 = {
    f () {
        return _wrap_async_generator(function*() {})();
    }
};
// @filename: O2.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
const o2 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield;
        })();
    }
};
// @filename: O3.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
const o3 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield 1;
        })();
    }
};
// @filename: O4.ts
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
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
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
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
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
const o6 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield _await_async_generator(1);
        })();
    }
};
// @filename: O7.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
const o7 = {
    f () {
        return _wrap_async_generator(function*() {
            return 1;
        })();
    }
};
