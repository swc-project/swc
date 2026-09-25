for (let __proto__ = 0, read = () => __proto__;;) {
    __proto__ = function () {};
    console.log(__proto__.name, read());
    __proto__ = () => __proto__;
    console.log(__proto__.name, __proto__() === __proto__);
    console.log(Object.getOwnPropertyDescriptor(__proto__, "name"));
    __proto__ = class {};
    console.log(__proto__.name);
    break;
}
