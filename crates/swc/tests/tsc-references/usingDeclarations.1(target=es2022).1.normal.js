//// [usingDeclarations.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    const d1 = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {}
    }, false);
    function f() {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d2 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    async function af() {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d3 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
            await null;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    function* g() {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d4 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
            yield;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    async function* ag() {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d5 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
            yield;
            await null;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    const a = ()=>{
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d6 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    };
    class C1 {
        constructor(){
            this.a = ()=>{
                const env = {
                    stack: [],
                    error: void 0,
                    hasError: false
                };
                try {
                    const d7 = _ts_add_disposable_resource(env, {
                        [Symbol.dispose] () {}
                    }, false);
                } catch (e) {
                    env.error = e;
                    env.hasError = true;
                } finally{
                    _ts_dispose_resources(env);
                }
            };
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d8 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        static{
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d9 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        m() {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d10 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        get x() {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d11 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                return 0;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        set x(v) {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d12 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        async am() {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d13 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                await null;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        *g() {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d14 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                yield;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        async *ag() {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d15 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                yield;
                await null;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    }
    class C2 extends C1 {
        constructor(){
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d16 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                super();
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    }
    class C3 extends C1 {
        constructor(){
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d17 = _ts_add_disposable_resource(env, {
                    [Symbol.dispose] () {}
                }, false);
                super(), this.y = 1;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
    }
    (function(N) {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d18 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    })(N || (N = {}));
    {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d19 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    switch(Math.random()){
        case 0:
            const env1 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d20 = _ts_add_disposable_resource(env1, {
                    [Symbol.dispose] () {}
                }, false);
                break;
            } catch (e) {
                env1.error = e;
                env1.hasError = true;
            } finally{
                _ts_dispose_resources(env1);
            }
        case 1:
            const env2 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d21 = _ts_add_disposable_resource(env2, {
                    [Symbol.dispose] () {}
                }, false);
                break;
            } catch (e) {
                env2.error = e;
                env2.hasError = true;
            } finally{
                _ts_dispose_resources(env2);
            }
    }
    if (true) switch(0){
        case 0:
            const env3 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d22 = _ts_add_disposable_resource(env3, {
                    [Symbol.dispose] () {}
                }, false);
                break;
            } catch (e) {
                env3.error = e;
                env3.hasError = true;
            } finally{
                _ts_dispose_resources(env3);
            }
    }
    try {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d23 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    } catch  {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d24 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    } finally{
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d25 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    if (true) {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d26 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    } else {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d27 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    while(true){
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d28 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
            break;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    do {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d29 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
            break;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }while (true)
    for(;;){
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d30 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
            break;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for(const x in {}){
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d31 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    for (const x of []){
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d32 = _ts_add_disposable_resource(env, {
                [Symbol.dispose] () {}
            }, false);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            _ts_dispose_resources(env);
        }
    }
    var N;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { };
