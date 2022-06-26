import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
// @target: es2015
// @lib: esnext
// @filename: C1.ts
class C1 {
    f() {
        return _wrap_async_generator(function*() {})();
    }
}
// @filename: C2.ts
class C2 {
    f() {
        return _wrap_async_generator(function*() {
            const x = yield;
        })();
    }
}
// @filename: C3.ts
class C3 {
    f() {
        return _wrap_async_generator(function*() {
            const x = yield 1;
        })();
    }
}
// @filename: C4.ts
class C4 {
    f() {
        return _wrap_async_generator(function*() {
            const x = yield* _async_generator_delegate(_async_iterator([
                1
            ]), _await_async_generator);
        })();
    }
}
// @filename: C5.ts
class C5 {
    f() {
        return _wrap_async_generator(function*() {
            const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
                yield 1;
            })()), _await_async_generator);
        })();
    }
}
// @filename: C6.ts
class C6 {
    f() {
        return _wrap_async_generator(function*() {
            const x = yield _await_async_generator(1);
        })();
    }
}
// @filename: C7.ts
class C7 {
    f() {
        return _wrap_async_generator(function*() {
            return 1;
        })();
    }
}
// @filename: C8.ts
class C8 {
    g() {}
    f() {
        var _this = this;
        return _wrap_async_generator(function*() {
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
        return _wrap_async_generator(function*() {
            _superprop_get_g().call(_this);
        })();
    }
}
