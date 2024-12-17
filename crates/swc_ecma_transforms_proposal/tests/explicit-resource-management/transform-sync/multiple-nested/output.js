{
    const env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        const x = _ts_add_disposable_resource(env, obj, false);
        {
            const env = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                const y = _ts_add_disposable_resource(env, call(()=>{
                    const env = {
                        stack: [],
                        error: void 0,
                        hasError: false
                    };
                    try {
                        const z = _ts_add_disposable_resource(env, obj, false);
                        return z;
                    } catch (e) {
                        env.error = e;
                        env.hasError = true;
                    } finally{
                        _ts_dispose_resources(env);
                    }
                }), false);
                stmt;
            } catch (e) {
                env.error = e;
                env.hasError = true;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        stmt;
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources(env);
    }
}
