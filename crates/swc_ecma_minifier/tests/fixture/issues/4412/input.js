export function foo(arg) {
    switch (arg) {
        case ENUM_VALUE: {
            const { data } = arg;
            call(data);
            break;
        }
        default:
            break;
    }
}
