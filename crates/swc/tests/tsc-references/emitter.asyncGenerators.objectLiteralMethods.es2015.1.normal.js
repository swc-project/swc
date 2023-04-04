//// [O1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o1 = {
    f () {
        return _wrap_async_generator(function*() {})();
    }
};
//// [O2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o2 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield;
        })();
    }
};
//// [O3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o3 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield 1;
        })();
    }
};
//// [O4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o4 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield* _async_generator_delegate(_async_iterator([
                1
            ]), _await_async_generator);
        })();
    }
};
//// [O5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o5 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
                yield 1;
            })()), _await_async_generator);
        })();
    }
};
//// [O6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o6 = {
    f () {
        return _wrap_async_generator(function*() {
            const x = yield _await_async_generator(1);
        })();
    }
};
//// [O7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const o7 = {
    f () {
        return _wrap_async_generator(function*() {
            return 1;
        })();
    }
};
