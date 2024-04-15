//// [usingDeclarations.12.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
class C1 {
    constructor(){}
}
class C2 extends C1 {
    constructor(){
        try {
            var _usingCtx = _using_ctx();
            super();
            this.y = 1;
            const d17 = _usingCtx.u({
                [Symbol.dispose] () {}
            });
        } catch (_) {
            _usingCtx.e = _;
        } finally{
            _usingCtx.d();
        }
    }
}
