import * as swcHelpers from "@swc/helpers";
// @target: es2015
// @lib: esnext
// @filename: C1.ts
class C1 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {})();
    }
}
// @filename: C2.ts
class C2 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield;
        })();
    }
}
// @filename: C3.ts
class C3 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield 1;
        })();
    }
}
// @filename: C4.ts
class C4 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
                1
            ]), swcHelpers.awaitAsyncGenerator);
        })();
    }
}
// @filename: C5.ts
class C5 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
                yield 1;
            })()), swcHelpers.awaitAsyncGenerator);
        })();
    }
}
// @filename: C6.ts
class C6 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            const x = yield swcHelpers.awaitAsyncGenerator(1);
        })();
    }
}
// @filename: C7.ts
class C7 {
    f() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            return 1;
        })();
    }
}
// @filename: C8.ts
class C8 {
    g() {}
    f() {
        var _this = this;
        return swcHelpers.wrapAsyncGenerator(function*() {
            _this.g();
        })();
    }
}
// @filename: C9.ts
class B9 {
    g() {}
}
class C9 extends B9 {
    f() {
        var _this = this, _superprop_get_g = ()=>super.g;
        return swcHelpers.wrapAsyncGenerator(function*() {
            _superprop_get_g().call(_this);
        })();
    }
}
