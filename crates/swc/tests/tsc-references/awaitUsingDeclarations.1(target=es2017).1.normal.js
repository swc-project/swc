//// [awaitUsingDeclarations.1.ts]
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    const d1 = _ts_add_disposable_resource(env, {
        async [Symbol.asyncDispose] () {}
    }, true);
    async function af() {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d3 = _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, true);
            await null;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
            yield;
            await null;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    }
    const a = async ()=>{
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d6 = _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    };
    class C1 {
        async am() {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d13 = _ts_add_disposable_resource(env, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                await null;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env);
                if (result) await result;
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
                    async [Symbol.asyncDispose] () {}
                }, true);
                yield;
                await null;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env);
                if (result) await result;
            }
        }
        constructor(){
            this.a = async ()=>{
                const env = {
                    stack: [],
                    error: void 0,
                    hasError: false
                };
                try {
                    const d7 = _ts_add_disposable_resource(env, {
                        async [Symbol.asyncDispose] () {}
                    }, true);
                } catch (e) {
                    env.error = e;
                    env.hasError = true;
                } finally{
                    const result = _ts_dispose_resources(env);
                    if (result) await result;
                }
            };
        }
    }
    {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d19 = _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                    async [Symbol.asyncDispose] () {}
                }, true);
                break;
            } catch (e) {
                env1.error = e;
                env1.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env1);
                if (result) await result;
            }
        case 1:
            const env2 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const d21 = _ts_add_disposable_resource(env2, {
                    async [Symbol.asyncDispose] () {}
                }, true);
                break;
            } catch (e) {
                env2.error = e;
                env2.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env2);
                if (result) await result;
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
                    async [Symbol.asyncDispose] () {}
                }, true);
                break;
            } catch (e) {
                env3.error = e;
                env3.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env3);
                if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    } catch (e) {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d24 = _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    } finally{
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d25 = _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    } else {
        const env = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            const d27 = _ts_add_disposable_resource(env, {
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
            break;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
            break;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
            break;
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
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
                async [Symbol.asyncDispose] () {}
            }, true);
        } catch (e) {
            env.error = e;
            env.hasError = true;
        } finally{
            const result = _ts_dispose_resources(env);
            if (result) await result;
        }
    }
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    const result = _ts_dispose_resources(env);
    if (result) await result;
}
export { };
