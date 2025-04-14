export class Quirk {
    doStuff() {
        return /*#__PURE__*/ _async_to_generator(function*() {
            const args = arguments;
            console.log(args);
            return {
                foo: null,
                ...args[0]
            };
        }).apply(this, arguments);
    }
}
