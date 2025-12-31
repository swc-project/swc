//// [usingDeclarations.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
let env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {}
    }, !1);
    let env1 = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        _ts_add_disposable_resource(env1, {
            [Symbol.dispose] () {}
        }, !1);
    } catch (e) {
        env1.error = e, env1.hasError = !0;
    } finally{
        _ts_dispose_resources(env1);
    }
    N || (N = {});
    let env2 = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        _ts_add_disposable_resource(env2, {
            [Symbol.dispose] () {}
        }, !1);
    } catch (e) {
        env2.error = e, env2.hasError = !0;
    } finally{
        _ts_dispose_resources(env2);
    }
    {
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    switch(Math.random()){
        case 0:
            let env11 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env11, {
                    [Symbol.dispose] () {}
                }, !1);
                break;
            } catch (e) {
                env11.error = e, env11.hasError = !0;
            } finally{
                _ts_dispose_resources(env11);
            }
        case 1:
            let env21 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env21, {
                    [Symbol.dispose] () {}
                }, !1);
            } catch (e) {
                env21.error = e, env21.hasError = !0;
            } finally{
                _ts_dispose_resources(env21);
            }
    }
    {
        let env3 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env3, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env3.error = e, env3.hasError = !0;
        } finally{
            _ts_dispose_resources(env3);
        }
    }
    try {
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    } catch (unused) {
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    } finally{
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    {
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for(;;){
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
            break;
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for(;;){
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
            break;
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for(;;){
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
            break;
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for(let x in {}){
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for (let x of []){
        let env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, !1);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            _ts_dispose_resources(env);
        }
    }
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources(env);
}
