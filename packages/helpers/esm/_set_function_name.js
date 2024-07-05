export function _set_function_name(fn, name, prefix) {
    if (typeof name === "symbol") {
        name = name.description;
        name = name ? "[" + name + "]" : "";
    }
    try {
        Object.defineProperty(fn, "name", {
            configurable: true,
            value: prefix ? prefix + " " + name : name
        });
    } catch (_) { }
    return fn;
}

export { _set_function_name as _ }