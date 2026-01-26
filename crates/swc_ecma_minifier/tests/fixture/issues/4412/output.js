export function foo(arg) {
    if (arg === ENUM_VALUE) {
        let { data } = arg;
        call(data);
    }
}
