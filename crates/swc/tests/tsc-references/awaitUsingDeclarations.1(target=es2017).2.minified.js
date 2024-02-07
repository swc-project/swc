//// [awaitUsingDeclarations.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [];
    _using(_stack, {
        async [Symbol.asyncDispose] () {}
    }, !0);
    try {
        var _stack1 = [];
        _using(_stack1, {
            async [Symbol.asyncDispose] () {}
        }, !0);
    } catch (_) {
        var _error = _, _hasError = !0;
    } finally{
        await _dispose(_stack1, _error, _hasError);
    }
    switch(Math.random()){
        case 0:
            try {
                var _stack2 = [];
                _using(_stack2, {
                    async [Symbol.asyncDispose] () {}
                }, !0);
                break;
            } catch (_) {
                var _error1 = _, _hasError1 = !0;
            } finally{
                await _dispose(_stack2, _error1, _hasError1);
            }
        case 1:
            try {
                var _stack3 = [];
                _using(_stack3, {
                    async [Symbol.asyncDispose] () {}
                }, !0);
            } catch (_) {
                var _error2 = _, _hasError2 = !0;
            } finally{
                await _dispose(_stack3, _error2, _hasError2);
            }
    }
    try {
        var _stack4 = [];
        _using(_stack4, {
            async [Symbol.asyncDispose] () {}
        }, !0);
    } catch (_) {
        var _error3 = _, _hasError3 = !0;
    } finally{
        await _dispose(_stack4, _error3, _hasError3);
    }
    try {
        try {
            var _stack5 = [];
            _using(_stack5, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (_) {
            var _error4 = _, _hasError4 = !0;
        } finally{
            await _dispose(_stack5, _error4, _hasError4);
        }
    } catch (e) {
        try {
            var _stack6 = [];
            _using(_stack6, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (_) {
            var _error5 = _, _hasError5 = !0;
        } finally{
            await _dispose(_stack6, _error5, _hasError5);
        }
    } finally{
        try {
            var _stack7 = [];
            _using(_stack7, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (_) {
            var _error6 = _, _hasError6 = !0;
        } finally{
            await _dispose(_stack7, _error6, _hasError6);
        }
    }
    try {
        var _stack8 = [];
        _using(_stack8, {
            async [Symbol.asyncDispose] () {}
        }, !0);
    } catch (_) {
        var _error7 = _, _hasError7 = !0;
    } finally{
        await _dispose(_stack8, _error7, _hasError7);
    }
    for(;;)try {
        var _stack10 = [];
        _using(_stack10, {
            async [Symbol.asyncDispose] () {}
        }, !0);
        break;
    } catch (_) {
        var _error9 = _, _hasError9 = !0;
    } finally{
        await _dispose(_stack10, _error9, _hasError9);
    }
    for(;;)try {
        var _stack11 = [];
        _using(_stack11, {
            async [Symbol.asyncDispose] () {}
        }, !0);
        break;
    } catch (_) {
        var _error10 = _, _hasError10 = !0;
    } finally{
        await _dispose(_stack11, _error10, _hasError10);
    }
    for(;;)try {
        var _stack12 = [];
        _using(_stack12, {
            async [Symbol.asyncDispose] () {}
        }, !0);
        break;
    } catch (_) {
        var _error11 = _, _hasError11 = !0;
    } finally{
        await _dispose(_stack12, _error11, _hasError11);
    }
    for(let x in {})try {
        var _stack13 = [];
        _using(_stack13, {
            async [Symbol.asyncDispose] () {}
        }, !0);
    } catch (_) {
        var _error12 = _, _hasError12 = !0;
    } finally{
        await _dispose(_stack13, _error12, _hasError12);
    }
    for (let x of [])try {
        var _stack14 = [];
        _using(_stack14, {
            async [Symbol.asyncDispose] () {}
        }, !0);
    } catch (_) {
        var _error13 = _, _hasError13 = !0;
    } finally{
        await _dispose(_stack14, _error13, _hasError13);
    }
} catch (_) {
    var _error14 = _, _hasError14 = !0;
} finally{
    await _dispose(_stack, _error14, _hasError14);
}
