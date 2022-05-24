import _async_generator_delegate from "@swc/helpers/lib/_async_generator_delegate.js";
import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
function inferReturnType1() {
    return _inferReturnType1.apply(this, arguments);
}
function _inferReturnType1() {
    _inferReturnType1 = // @target: es2018
    // @lib: esnext
    // @noEmit: true
    _wrap_async_generator(function*() {});
    return _inferReturnType1.apply(this, arguments);
}
function inferReturnType2() {
    return _inferReturnType2.apply(this, arguments);
}
function _inferReturnType2() {
    _inferReturnType2 = _wrap_async_generator(function*() {
        yield;
    });
    return _inferReturnType2.apply(this, arguments);
}
function inferReturnType3() {
    return _inferReturnType3.apply(this, arguments);
}
function _inferReturnType3() {
    _inferReturnType3 = _wrap_async_generator(function*() {
        yield 1;
    });
    return _inferReturnType3.apply(this, arguments);
}
function inferReturnType4() {
    return _inferReturnType4.apply(this, arguments);
}
function _inferReturnType4() {
    _inferReturnType4 = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return _inferReturnType4.apply(this, arguments);
}
function inferReturnType5() {
    return _inferReturnType5.apply(this, arguments);
}
function _inferReturnType5() {
    _inferReturnType5 = _wrap_async_generator(function*() {
        yield 1;
        yield Promise.resolve(2);
    });
    return _inferReturnType5.apply(this, arguments);
}
function inferReturnType6() {
    return _inferReturnType6.apply(this, arguments);
}
function _inferReturnType6() {
    _inferReturnType6 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return _inferReturnType6.apply(this, arguments);
}
function inferReturnType7() {
    return _inferReturnType7.apply(this, arguments);
}
function _inferReturnType7() {
    _inferReturnType7 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return _inferReturnType7.apply(this, arguments);
}
function inferReturnType8() {
    return _inferReturnType8.apply(this, arguments);
}
function _inferReturnType8() {
    _inferReturnType8 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return _inferReturnType8.apply(this, arguments);
}
const assignability1 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield 1;
    });
    return function assignability1() {
        return _ref.apply(this, arguments);
    };
}();
const assignability2 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return function assignability2() {
        return _ref.apply(this, arguments);
    };
}();
const assignability3 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return function assignability3() {
        return _ref.apply(this, arguments);
    };
}();
const assignability4 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return function assignability4() {
        return _ref.apply(this, arguments);
    };
}();
const assignability5 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return function assignability5() {
        return _ref.apply(this, arguments);
    };
}();
const assignability6 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield 1;
    });
    return function assignability6() {
        return _ref.apply(this, arguments);
    };
}();
const assignability7 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return function assignability7() {
        return _ref.apply(this, arguments);
    };
}();
const assignability8 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return function assignability8() {
        return _ref.apply(this, arguments);
    };
}();
const assignability9 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return function assignability9() {
        return _ref.apply(this, arguments);
    };
}();
const assignability10 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return function assignability10() {
        return _ref.apply(this, arguments);
    };
}();
const assignability11 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield 1;
    });
    return function assignability11() {
        return _ref.apply(this, arguments);
    };
}();
const assignability12 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return function assignability12() {
        return _ref.apply(this, arguments);
    };
}();
const assignability13 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return function assignability13() {
        return _ref.apply(this, arguments);
    };
}();
const assignability14 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return function assignability14() {
        return _ref.apply(this, arguments);
    };
}();
const assignability15 = function() {
    var _ref = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return function assignability15() {
        return _ref.apply(this, arguments);
    };
}();
function explicitReturnType1() {
    return _explicitReturnType1.apply(this, arguments);
}
function _explicitReturnType1() {
    _explicitReturnType1 = _wrap_async_generator(function*() {
        yield 1;
    });
    return _explicitReturnType1.apply(this, arguments);
}
function explicitReturnType2() {
    return _explicitReturnType2.apply(this, arguments);
}
function _explicitReturnType2() {
    _explicitReturnType2 = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return _explicitReturnType2.apply(this, arguments);
}
function explicitReturnType3() {
    return _explicitReturnType3.apply(this, arguments);
}
function _explicitReturnType3() {
    _explicitReturnType3 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return _explicitReturnType3.apply(this, arguments);
}
function explicitReturnType4() {
    return _explicitReturnType4.apply(this, arguments);
}
function _explicitReturnType4() {
    _explicitReturnType4 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return _explicitReturnType4.apply(this, arguments);
}
function explicitReturnType5() {
    return _explicitReturnType5.apply(this, arguments);
}
function _explicitReturnType5() {
    _explicitReturnType5 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return _explicitReturnType5.apply(this, arguments);
}
function explicitReturnType6() {
    return _explicitReturnType6.apply(this, arguments);
}
function _explicitReturnType6() {
    _explicitReturnType6 = _wrap_async_generator(function*() {
        yield 1;
    });
    return _explicitReturnType6.apply(this, arguments);
}
function explicitReturnType7() {
    return _explicitReturnType7.apply(this, arguments);
}
function _explicitReturnType7() {
    _explicitReturnType7 = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return _explicitReturnType7.apply(this, arguments);
}
function explicitReturnType8() {
    return _explicitReturnType8.apply(this, arguments);
}
function _explicitReturnType8() {
    _explicitReturnType8 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return _explicitReturnType8.apply(this, arguments);
}
function explicitReturnType9() {
    return _explicitReturnType9.apply(this, arguments);
}
function _explicitReturnType9() {
    _explicitReturnType9 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return _explicitReturnType9.apply(this, arguments);
}
function explicitReturnType10() {
    return _explicitReturnType10.apply(this, arguments);
}
function _explicitReturnType10() {
    _explicitReturnType10 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return _explicitReturnType10.apply(this, arguments);
}
function explicitReturnType11() {
    return _explicitReturnType11.apply(this, arguments);
}
function _explicitReturnType11() {
    _explicitReturnType11 = _wrap_async_generator(function*() {
        yield 1;
    });
    return _explicitReturnType11.apply(this, arguments);
}
function explicitReturnType12() {
    return _explicitReturnType12.apply(this, arguments);
}
function _explicitReturnType12() {
    _explicitReturnType12 = _wrap_async_generator(function*() {
        yield Promise.resolve(1);
    });
    return _explicitReturnType12.apply(this, arguments);
}
function explicitReturnType13() {
    return _explicitReturnType13.apply(this, arguments);
}
function _explicitReturnType13() {
    _explicitReturnType13 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2
        ]), _await_async_generator);
    });
    return _explicitReturnType13.apply(this, arguments);
}
function explicitReturnType14() {
    return _explicitReturnType14.apply(this, arguments);
}
function _explicitReturnType14() {
    _explicitReturnType14 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            Promise.resolve(1)
        ]), _await_async_generator);
    });
    return _explicitReturnType14.apply(this, arguments);
}
function explicitReturnType15() {
    return _explicitReturnType15.apply(this, arguments);
}
function _explicitReturnType15() {
    _explicitReturnType15 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return _explicitReturnType15.apply(this, arguments);
}
function explicitReturnType16() {
    return _explicitReturnType16.apply(this, arguments);
}
function _explicitReturnType16() {
    _explicitReturnType16 = _wrap_async_generator(function*() {
        yield 1;
    });
    return _explicitReturnType16.apply(this, arguments);
}
function awaitedType1() {
    return _awaitedType1.apply(this, arguments);
}
function _awaitedType1() {
    _awaitedType1 = _wrap_async_generator(function*() {
        const x = yield _await_async_generator(1);
    });
    return _awaitedType1.apply(this, arguments);
}
function awaitedType2() {
    return _awaitedType2.apply(this, arguments);
}
function _awaitedType2() {
    _awaitedType2 = _wrap_async_generator(function*() {
        const x = yield _await_async_generator(Promise.resolve(1));
    });
    return _awaitedType2.apply(this, arguments);
}
function nextType1() {
    return _nextType1.apply(this, arguments);
}
function _nextType1() {
    _nextType1 = _wrap_async_generator(function*() {
        const x = yield; // `number | PromiseLike<number>` (should not await TNext)
    });
    return _nextType1.apply(this, arguments);
}
