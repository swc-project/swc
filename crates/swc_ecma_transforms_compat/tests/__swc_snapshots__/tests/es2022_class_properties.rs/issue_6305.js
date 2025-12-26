var _x = new WeakMap();
class x {
}
_x.set(x, {
    writable: true,
    value: Object.getPrototypeOf(x).x = 0
});
