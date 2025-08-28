//// [awaitUsingDeclarations.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, !0);
    {
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    switch(Math.random()){
        case 0:
            const env1 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env1, {
                    async [Symbol.asyncDispose] () {}
                }, !0);
                break;
            } catch (e) {
                env1.error = e, env1.hasError = !0;
            } finally{
                const result = _ts_dispose_resources(env1);
                result && await result;
            }
        case 1:
            const env2 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env2, {
                    async [Symbol.asyncDispose] () {}
                }, !0);
            } catch (e) {
                env2.error = e, env2.hasError = !0;
            } finally{
                const result = _ts_dispose_resources(env2);
                result && await result;
            }
    }
    {
        const env3 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env3, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env3.error = e, env3.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env3);
            result && await result;
        }
    }
    try {
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    } catch  {
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    } finally{
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    {
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    for(;;){
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
            break;
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    for(;;){
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
            break;
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    for(;;){
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
            break;
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    for(const x in {}){
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
    for (const x of []){
        const env = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, !0);
        } catch (e) {
            env.error = e, env.hasError = !0;
        } finally{
            const result = _ts_dispose_resources(env);
            result && await result;
        }
    }
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    const result = _ts_dispose_resources(env);
    result && await result;
}
