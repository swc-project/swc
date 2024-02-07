//// [awaitUsingDeclarations.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
async function af() {
    try {
        var _stack = [];
        var d3 = _using(_stack, {
            async [Symbol.asyncDispose] () {}
        }, true);
        await null;
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
async function* ag() {
    try {
        var _stack = [];
        var d5 = _using(_stack, {
            async [Symbol.asyncDispose] () {}
        }, true);
        yield;
        await null;
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
try {
    var _stack = [];
    var d1 = _using(_stack, {
        async [Symbol.asyncDispose] () {}
    }, true);
    var a = async ()=>{
        try {
            var _stack = [];
            var d6 = _using(_stack, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            await _dispose(_stack, _error, _hasError);
        }
    };
    class C1 {
        async am() {
            try {
                var _stack = [];
                var d13 = _using(_stack, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                await null;
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                await _dispose(_stack, _error, _hasError);
            }
        }
        async *ag() {
            try {
                var _stack = [];
                var d15 = _using(_stack, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                yield;
                await null;
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                await _dispose(_stack, _error, _hasError);
            }
        }
        constructor(){
            this.a = async ()=>{
                try {
                    var _stack = [];
                    var d7 = _using(_stack, {
                        async [Symbol.asyncDispose] () {}
                    }, true);
                } catch (_) {
                    var _error = _;
                    var _hasError = true;
                } finally{
                    await _dispose(_stack, _error, _hasError);
                }
            };
        }
    }
    {
        try {
            var _stack1 = [];
            var d19 = _using(_stack1, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            await _dispose(_stack1, _error, _hasError);
        }
    }
    switch(Math.random()){
        case 0:
            try {
                var _stack2 = [];
                var d20 = _using(_stack2, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                break;
            } catch (_) {
                var _error1 = _;
                var _hasError1 = true;
            } finally{
                await _dispose(_stack2, _error1, _hasError1);
            }
        case 1:
            try {
                var _stack3 = [];
                var d21 = _using(_stack3, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                break;
            } catch (_) {
                var _error2 = _;
                var _hasError2 = true;
            } finally{
                await _dispose(_stack3, _error2, _hasError2);
            }
    }
    if (true) switch(0){
        case 0:
            try {
                var _stack4 = [];
                var d22 = _using(_stack4, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                break;
            } catch (_) {
                var _error3 = _;
                var _hasError3 = true;
            } finally{
                await _dispose(_stack4, _error3, _hasError3);
            }
    }
    try {
        try {
            var _stack5 = [];
            var d23 = _using(_stack5, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error4 = _;
            var _hasError4 = true;
        } finally{
            await _dispose(_stack5, _error4, _hasError4);
        }
    } catch (e) {
        try {
            var _stack6 = [];
            var d24 = _using(_stack6, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error5 = _;
            var _hasError5 = true;
        } finally{
            await _dispose(_stack6, _error5, _hasError5);
        }
    } finally{
        try {
            var _stack7 = [];
            var d25 = _using(_stack7, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error6 = _;
            var _hasError6 = true;
        } finally{
            await _dispose(_stack7, _error6, _hasError6);
        }
    }
    if (true) {
        try {
            var _stack8 = [];
            var d26 = _using(_stack8, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error7 = _;
            var _hasError7 = true;
        } finally{
            await _dispose(_stack8, _error7, _hasError7);
        }
    } else {
        try {
            var _stack9 = [];
            var d27 = _using(_stack9, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error8 = _;
            var _hasError8 = true;
        } finally{
            await _dispose(_stack9, _error8, _hasError8);
        }
    }
    while(true){
        try {
            var _stack10 = [];
            var d28 = _using(_stack10, {
                async [Symbol.asyncDispose] () {}
            }, true);
            break;
        } catch (_) {
            var _error9 = _;
            var _hasError9 = true;
        } finally{
            await _dispose(_stack10, _error9, _hasError9);
        }
    }
    do {
        try {
            var _stack11 = [];
            var d29 = _using(_stack11, {
                async [Symbol.asyncDispose] () {}
            }, true);
            break;
        } catch (_) {
            var _error10 = _;
            var _hasError10 = true;
        } finally{
            await _dispose(_stack11, _error10, _hasError10);
        }
    }while (true)
    for(;;){
        try {
            var _stack12 = [];
            var d30 = _using(_stack12, {
                async [Symbol.asyncDispose] () {}
            }, true);
            break;
        } catch (_) {
            var _error11 = _;
            var _hasError11 = true;
        } finally{
            await _dispose(_stack12, _error11, _hasError11);
        }
    }
    for(const x in {}){
        try {
            var _stack13 = [];
            var d31 = _using(_stack13, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error12 = _;
            var _hasError12 = true;
        } finally{
            await _dispose(_stack13, _error12, _hasError12);
        }
    }
    for (const x of []){
        try {
            var _stack14 = [];
            var d32 = _using(_stack14, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (_) {
            var _error13 = _;
            var _hasError13 = true;
        } finally{
            await _dispose(_stack14, _error13, _hasError13);
        }
    }
} catch (_) {
    var _error14 = _;
    var _hasError14 = true;
} finally{
    await _dispose(_stack, _error14, _hasError14);
}
export { };
