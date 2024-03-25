//// [awaitUsingDeclarationsInForAwaitOf.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
async function main() {
    for await (const d1 of [
        {
            async [Symbol.asyncDispose] () {}
        },
        {
            [Symbol.dispose] () {}
        },
        null,
        undefined
    ]){
        try {
            var _stack = [];
            {}
        } catch (_) {
            var _error = _;
            var _hasError = true;
        } finally{
            _dispose(_stack, _error, _hasError);
        }
    }
}
