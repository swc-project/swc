function registerHook(key) {
    return (...args) => console.log(args);
}

export default function design(base: typeof Component) {
    const Design = "test name conflict";
    return class Design extends base {
        copy() {
            console.log("copy");
        }

        @registerHook("beforeRender")
        @registerHook("afterRender")
        render() {
            super.render();
            console.log("design render");
        }
    };
}
