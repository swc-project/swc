import * as swcHelpers from "@swc/helpers";
// @target: es5
// @lib: esnext
// @filename: O1.ts
const o1 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {})();
    }
};
// @filename: O2.ts
const o2 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield;
        })();
    }
};
// @filename: O3.ts
const o3 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield 1;
        })();
    }
};
// @filename: O4.ts
const o4 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
                1
            ]), swcHelpers.awaitAsyncGenerator);
        })();
    }
};
// @filename: O5.ts
const o5 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
                yield 1;
            })()), swcHelpers.awaitAsyncGenerator);
        })();
    }
};
// @filename: O6.ts
const o6 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield swcHelpers.awaitAsyncGenerator(1);
        })();
    }
};
// @filename: O7.ts
const o7 = {
    f () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            return 1;
        })();
    }
};
