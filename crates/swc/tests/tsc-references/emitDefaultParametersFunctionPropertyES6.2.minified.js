//// [emitDefaultParametersFunctionPropertyES6.ts]
var obj2 = {
    func1 (y = 10, ...rest) {},
    func2 (x = "hello") {},
    func3 (x, z, y = "hello") {},
    func4 (x, z, y = "hello", ...rest) {}
};
