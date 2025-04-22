const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    console.log(1);
    var _default = class {
        static{
            console.log(2);
        }
    };
    var C = class {
        [Symbol.dispose]() {
            console.log("dispose");
        }
        static{
            console.log(3);
        }
    };
    console.log(4);
    var _ = _ts_add_disposable_resource(env, new C(), false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { _default as default };
