function AsyncGenerator(gen) {
    var front, back;
    function send(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            if (back) {
                back = back.next = request;
            } else {
                front = back = request;
                resume(key, arg);
            }
        });
    }
    function resume(key, arg) {
        try {
            var result = gen[key](arg);
            var value = result.value;
            var wrappedAwait = value instanceof _AwaitValue;
            Promise.resolve(wrappedAwait ? value.wrapped : value).then(function(arg) {
                if (wrappedAwait) {
                    resume("next", arg);
                    return;
                }
                settle(result.done ? "return" : "normal", arg);
            }, function(err) {
                resume("throw", err);
            });
        } catch (err) {
            settle("throw", err);
        }
    }
    function settle(type, value) {
        switch(type){
            case "return":
                front.resolve({
                    value: value,
                    done: true
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: false
                });
                break;
        }
        front = front.next;
        if (front) {
            resume(front.key, front.arg);
        } else {
            back = null;
        }
    }
    this._invoke = send;
    if (typeof gen.return !== "function") {
        this.return = undefined;
    }
}
if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
        return this;
    };
}
AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
};
AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
};
AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
function _AwaitValue(value) {
    this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
function inferReturnType1() {
    return _inferReturnType1.apply(this, arguments);
}
function _inferReturnType1() {
    _inferReturnType1 = // @target: es2018
    // @lib: esnext
    // @noEmit: true
    _wrapAsyncGenerator(function*() {
        yield* {
        };
    });
    return _inferReturnType1.apply(this, arguments);
}
function inferReturnType2() {
    return _inferReturnType2.apply(this, arguments);
}
function _inferReturnType2() {
    _inferReturnType2 = _wrapAsyncGenerator(function*() {
        yield* inferReturnType2();
    });
    return _inferReturnType2.apply(this, arguments);
}
function inferReturnType3() {
    return _inferReturnType3.apply(this, arguments);
}
function _inferReturnType3() {
    _inferReturnType3 = _wrapAsyncGenerator(function*() {
        yield* Promise.resolve([
            1,
            2
        ]);
    });
    return _inferReturnType3.apply(this, arguments);
}
const assignability1 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield "a";
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability2 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield* [
            "a",
            "b"
        ];
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability3 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield* _wrapAsyncGenerator(function*() {
            yield "a";
        })();
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability4 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield "a";
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability5 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield* [
            "a",
            "b"
        ];
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability6 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield* _wrapAsyncGenerator(function*() {
            yield "a";
        })();
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability7 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield "a";
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability8 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield* [
            "a",
            "b"
        ];
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
const assignability9 = function() {
    var _ref = _wrapAsyncGenerator(function*() {
        yield* _wrapAsyncGenerator(function*() {
            yield "a";
        })();
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
function explicitReturnType1() {
    return _explicitReturnType1.apply(this, arguments);
}
function _explicitReturnType1() {
    _explicitReturnType1 = _wrapAsyncGenerator(function*() {
        yield "a";
    });
    return _explicitReturnType1.apply(this, arguments);
}
function explicitReturnType2() {
    return _explicitReturnType2.apply(this, arguments);
}
function _explicitReturnType2() {
    _explicitReturnType2 = _wrapAsyncGenerator(function*() {
        yield* [
            "a",
            "b"
        ];
    });
    return _explicitReturnType2.apply(this, arguments);
}
function explicitReturnType3() {
    return _explicitReturnType3.apply(this, arguments);
}
function _explicitReturnType3() {
    _explicitReturnType3 = _wrapAsyncGenerator(function*() {
        yield* _wrapAsyncGenerator(function*() {
            yield "a";
        })();
    });
    return _explicitReturnType3.apply(this, arguments);
}
function explicitReturnType4() {
    return _explicitReturnType4.apply(this, arguments);
}
function _explicitReturnType4() {
    _explicitReturnType4 = _wrapAsyncGenerator(function*() {
        yield "a";
    });
    return _explicitReturnType4.apply(this, arguments);
}
function explicitReturnType5() {
    return _explicitReturnType5.apply(this, arguments);
}
function _explicitReturnType5() {
    _explicitReturnType5 = _wrapAsyncGenerator(function*() {
        yield* [
            "a",
            "b"
        ];
    });
    return _explicitReturnType5.apply(this, arguments);
}
function explicitReturnType6() {
    return _explicitReturnType6.apply(this, arguments);
}
function _explicitReturnType6() {
    _explicitReturnType6 = _wrapAsyncGenerator(function*() {
        yield* _wrapAsyncGenerator(function*() {
            yield "a";
        })();
    });
    return _explicitReturnType6.apply(this, arguments);
}
function explicitReturnType7() {
    return _explicitReturnType7.apply(this, arguments);
}
function _explicitReturnType7() {
    _explicitReturnType7 = _wrapAsyncGenerator(function*() {
        yield "a";
    });
    return _explicitReturnType7.apply(this, arguments);
}
function explicitReturnType8() {
    return _explicitReturnType8.apply(this, arguments);
}
function _explicitReturnType8() {
    _explicitReturnType8 = _wrapAsyncGenerator(function*() {
        yield* [
            "a",
            "b"
        ];
    });
    return _explicitReturnType8.apply(this, arguments);
}
function explicitReturnType9() {
    return _explicitReturnType9.apply(this, arguments);
}
function _explicitReturnType9() {
    _explicitReturnType9 = _wrapAsyncGenerator(function*() {
        yield* _wrapAsyncGenerator(function*() {
            yield "a";
        })();
    });
    return _explicitReturnType9.apply(this, arguments);
}
function explicitReturnType10() {
    return _explicitReturnType10.apply(this, arguments);
}
function _explicitReturnType10() {
    _explicitReturnType10 = _wrapAsyncGenerator(function*() {
        yield 1;
    });
    return _explicitReturnType10.apply(this, arguments);
}
function explicitReturnType11() {
    return _explicitReturnType11.apply(this, arguments);
}
function _explicitReturnType11() {
    _explicitReturnType11 = _wrapAsyncGenerator(function*() {
        yield 1;
    });
    return _explicitReturnType11.apply(this, arguments);
}
function explicitReturnType12() {
    return _explicitReturnType12.apply(this, arguments);
}
function _explicitReturnType12() {
    _explicitReturnType12 = _wrapAsyncGenerator(function*() {
        yield 1;
    });
    return _explicitReturnType12.apply(this, arguments);
}
function yieldStar() {
    return _yieldStar.apply(this, arguments);
}
function _yieldStar() {
    _yieldStar = _wrapAsyncGenerator(function*() {
        yield* {
        };
    });
    return _yieldStar.apply(this, arguments);
}
