//// [usingDeclarations.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
let env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    var N;
    _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {}
    }, !1);
    class C1 {
        constructor(){
            this.a = ()=>{
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
            };
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
        static{
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
        m() {
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
        get x() {
            let env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                return _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, !1), 0;
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        set x(v) {
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
        async am() {
            let env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, !1), await null;
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        *g() {
            let env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, !1), yield;
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        async *ag() {
            let env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, !1), yield, await null;
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    }
    !function(N) {
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
    }(N || (N = {}));
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
            let env1 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env1, {
                    [Symbol.dispose] () {}
                }, !1);
                break;
            } catch (e) {
                env1.error = e, env1.hasError = !0;
            } finally{
                _ts_dispose_resources(env1);
            }
        case 1:
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
    } catch  {
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
