//// [callOfPropertylessConstructorFunction.js]
/**
 * @constructor
 */ function Dependency(j) {
    return j;
}
Dependency({});
