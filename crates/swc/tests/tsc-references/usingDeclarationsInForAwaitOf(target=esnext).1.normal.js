//// [usingDeclarationsInForAwaitOf.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
async function main() {
    for await (const d1 of [
        {
            [Symbol.dispose] () {}
        },
        null,
        undefined
    ]){
        try {
            var _usingCtx = _using_ctx();
            {}
        } catch (_) {
            _usingCtx.e = _;
        } finally{
            _usingCtx.d();
        }
    }
}
