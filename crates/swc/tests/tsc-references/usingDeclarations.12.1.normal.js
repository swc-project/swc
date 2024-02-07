//// [usingDeclarations.12.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
class C1 {
    constructor(){}
}
class C2 extends C1 {
    constructor(){
        try {
            var _stack = [];
            super();
            this.y = 1;
            var d17 = _using(_stack, {
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
