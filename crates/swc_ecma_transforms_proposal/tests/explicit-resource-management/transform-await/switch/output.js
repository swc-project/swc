async function f() {
    switch(v){
        case 0:
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const x = _ts_add_disposable_resource(env, 0, true);
                break;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env);
                if (result) await result;
            }
        default:
            const env1 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const y = _ts_add_disposable_resource(env1, 1, true);
                break;
            } catch (e) {
                env1.error = e;
                env1.hasError = true;
            } finally{
                const result = _ts_dispose_resources(env1);
                if (result) await result;
            }
    }
}
