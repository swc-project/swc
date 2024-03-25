import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
const logClean = function() {
    return {
        [Symbol.dispose] () {
            console.log("clean in sync");
        },
        [Symbol.asyncDispose] () {
            console.log("clean in async");
        }
    };
};
async function foo() {
    try {
        var _stack = [];
        var a = _using(_stack, logClean());
        var b = _using(_stack, logClean(), true);
        for (const a of [
            logClean(),
            logClean()
        ]){
            try {
                var _stack1 = [];
                {}
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack1, _error, _hasError);
            }
        }
        for (const a of [
            logClean(),
            logClean()
        ]){
            try {
                var _stack2 = [];
                {}
            } catch (_) {
                var _error1 = _;
                var _hasError1 = true;
            } finally{
                _dispose(_stack2, _error1, _hasError1);
            }
        }
    } catch (_) {
        var _error2 = _;
        var _hasError2 = true;
    } finally{
        await _dispose(_stack, _error2, _hasError2);
    }
}
foo();
