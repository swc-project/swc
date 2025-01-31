//// [usingDeclarations.12.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
class C1 {
    constructor(){}
}
class C2 extends C1 {
    constructor(){
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            super(), this.y = 1;
            const d17 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
}
