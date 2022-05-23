export function foo(arg) {
    if (arg === ENUM_VALUE) {
        const { data  } = arg;
        call(data);
    }
}
