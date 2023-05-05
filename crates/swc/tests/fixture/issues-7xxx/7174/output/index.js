var isBrowser = typeof window !== "undefined";
function test(param) {
    var _$window = param.window;
    create({
        window: _$window
    });
}
