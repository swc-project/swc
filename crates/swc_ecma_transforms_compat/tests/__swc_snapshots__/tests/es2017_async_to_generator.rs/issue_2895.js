export class Quirk {
    doStuff() {
        var _arguments = arguments;
        return _async_to_generator(function*() {
            const args = _arguments;
            console.log(args);
            return {
                foo: null,
                ...args[0]
            };
        })();
    }
}
