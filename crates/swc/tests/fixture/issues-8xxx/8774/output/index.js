import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
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
        var _usingCtx = _using_ctx();
        const a = _usingCtx.u(logClean());
        const b = _usingCtx.a(logClean());
        for (const a of [
            logClean(),
            logClean()
        ]){
            try {
                var _usingCtx1 = _using_ctx();
                {}
            } catch (_) {
                _usingCtx1.e = _;
            } finally{
                _usingCtx1.d();
            }
        }
        for (const a of [
            logClean(),
            logClean()
        ]){
            try {
                var _usingCtx2 = _using_ctx();
                {}
            } catch (_) {
                _usingCtx2.e = _;
            } finally{
                _usingCtx2.d();
            }
        }
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}
foo();
