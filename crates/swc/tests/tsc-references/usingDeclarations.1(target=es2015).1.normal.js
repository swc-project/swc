//// [usingDeclarations.1.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
function f() {
    try {
        var _stack = [];
        var d2 = _using(_stack, {
            [Symbol.dispose] () {}
        });
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
function af() {
    return _af.apply(this, arguments);
}
function _af() {
    _af = _async_to_generator(function*() {
        try {
            var _stack = [];
            var d3 = _using(_stack, {
                [Symbol.dispose] () {}
            });
            yield null;
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack, _error, _hasError);
        }
    });
    return _af.apply(this, arguments);
}
function* g() {
    try {
        var _stack = [];
        var d4 = _using(_stack, {
            [Symbol.dispose] () {}
        });
        yield;
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
function ag() {
    return _ag.apply(this, arguments);
}
function _ag() {
    _ag = _wrap_async_generator(function*() {
        try {
            var _stack = [];
            var d5 = _using(_stack, {
                [Symbol.dispose] () {}
            });
            yield;
            yield _await_async_generator(null);
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack, _error, _hasError);
        }
    });
    return _ag.apply(this, arguments);
}
try {
    var _stack = [];
    var d1 = _using(_stack, {
        [Symbol.dispose] () {}
    });
    var a = ()=>{
        try {
            var _stack = [];
            var d6 = _using(_stack, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack, _error, _hasError);
        }
    };
    class C1 {
        m() {
            try {
                var _stack = [];
                var d10 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
        get x() {
            try {
                var _stack = [];
                var d11 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
                return 0;
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
        set x(v) {
            try {
                var _stack = [];
                var d12 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
        am() {
            return _async_to_generator(function*() {
                try {
                    var _stack = [];
                    var d13 = _using(_stack, {
                        [Symbol.dispose] () {}
                    });
                    yield null;
                } catch (_) {
                    var _error = _;
                    var _hasError = true;
                } finally{
                    _dispose(_stack, _error, _hasError);
                }
            })();
        }
        *g() {
            try {
                var _stack = [];
                var d14 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
                yield;
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
        ag() {
            return _wrap_async_generator(function*() {
                try {
                    var _stack = [];
                    var d15 = _using(_stack, {
                        [Symbol.dispose] () {}
                    });
                    yield;
                    yield _await_async_generator(null);
                } catch (_) {
                    var _error = _;
                    var _hasError = true;
                } finally{
                    _dispose(_stack, _error, _hasError);
                }
            })();
        }
        constructor(){
            this.a = ()=>{
                try {
                    var _stack = [];
                    var d7 = _using(_stack, {
                        [Symbol.dispose] () {}
                    });
                } catch (_) {
                    var _error = _;
                    var _hasError = true;
                } finally{
                    _dispose(_stack, _error, _hasError);
                }
            };
            try {
                var _stack = [];
                var d8 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    }
    (()=>{
        try {
            var _stack = [];
            var d9 = _using(_stack, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack, _error, _hasError);
        }
    })();
    class C2 extends C1 {
        constructor(){
            try {
                var _stack = [];
                var d16 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
                super();
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    }
    class C3 extends C1 {
        constructor(){
            try {
                var _stack = [];
                var d17 = _using(_stack, {
                    [Symbol.dispose] () {}
                });
                super();
                this.y = 1;
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    }
    var N;
    (function(N) {
        try {
            var _stack = [];
            var d18 = _using(_stack, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack, _error, _hasError);
        }
    })(N || (N = {}));
    {
        try {
            var _stack1 = [];
            var d19 = _using(_stack1, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack1, _error, _hasError);
        }
    }
    switch(Math.random()){
        case 0:
            try {
                var _stack2 = [];
                var d20 = _using(_stack2, {
                    [Symbol.dispose] () {}
                });
                break;
            } catch (_) {
                var _error1 = _;
                var _hasError1 = true;
            } finally{
                _dispose(_stack2, _error1, _hasError1);
            }
        case 1:
            try {
                var _stack3 = [];
                var d21 = _using(_stack3, {
                    [Symbol.dispose] () {}
                });
                break;
            } catch (_) {
                var _error2 = _;
                var _hasError2 = true;
            } finally{
                _dispose(_stack3, _error2, _hasError2);
            }
    }
    if (true) switch(0){
        case 0:
            try {
                var _stack4 = [];
                var d22 = _using(_stack4, {
                    [Symbol.dispose] () {}
                });
                break;
            } catch (_) {
                var _error3 = _;
                var _hasError3 = true;
            } finally{
                _dispose(_stack4, _error3, _hasError3);
            }
    }
    try {
        try {
            var _stack5 = [];
            var d23 = _using(_stack5, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error4 = _;
            var _hasError4 = true;
        } finally{
            _dispose(_stack5, _error4, _hasError4);
        }
    } catch (e) {
        try {
            var _stack6 = [];
            var d24 = _using(_stack6, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error5 = _;
            var _hasError5 = true;
        } finally{
            _dispose(_stack6, _error5, _hasError5);
        }
    } finally{
        try {
            var _stack7 = [];
            var d25 = _using(_stack7, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error6 = _;
            var _hasError6 = true;
        } finally{
            _dispose(_stack7, _error6, _hasError6);
        }
    }
    if (true) {
        try {
            var _stack8 = [];
            var d26 = _using(_stack8, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error7 = _;
            var _hasError7 = true;
        } finally{
            _dispose(_stack8, _error7, _hasError7);
        }
    } else {
        try {
            var _stack9 = [];
            var d27 = _using(_stack9, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error8 = _;
            var _hasError8 = true;
        } finally{
            _dispose(_stack9, _error8, _hasError8);
        }
    }
    while(true){
        try {
            var _stack10 = [];
            var d28 = _using(_stack10, {
                [Symbol.dispose] () {}
            });
            break;
        } catch (_) {
            var _error9 = _;
            var _hasError9 = true;
        } finally{
            _dispose(_stack10, _error9, _hasError9);
        }
    }
    do {
        try {
            var _stack11 = [];
            var d29 = _using(_stack11, {
                [Symbol.dispose] () {}
            });
            break;
        } catch (_) {
            var _error10 = _;
            var _hasError10 = true;
        } finally{
            _dispose(_stack11, _error10, _hasError10);
        }
    }while (true)
    for(;;){
        try {
            var _stack12 = [];
            var d30 = _using(_stack12, {
                [Symbol.dispose] () {}
            });
            break;
        } catch (_) {
            var _error11 = _;
            var _hasError11 = true;
        } finally{
            _dispose(_stack12, _error11, _hasError11);
        }
    }
    for(const x in {}){
        try {
            var _stack13 = [];
            var d31 = _using(_stack13, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error12 = _;
            var _hasError12 = true;
        } finally{
            _dispose(_stack13, _error12, _hasError12);
        }
    }
    for (const x of []){
        try {
            var _stack14 = [];
            var d32 = _using(_stack14, {
                [Symbol.dispose] () {}
            });
        } catch (_) {
            var _error13 = _;
            var _hasError13 = true;
        } finally{
            _dispose(_stack14, _error13, _hasError13);
        }
    }
} catch (_) {
    var _error14 = _;
    var _hasError14 = true;
} finally{
    _dispose(_stack, _error14, _hasError14);
}
export { };
