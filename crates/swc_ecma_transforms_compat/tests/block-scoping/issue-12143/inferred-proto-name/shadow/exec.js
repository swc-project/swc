function check(Object) {
    for (let __proto__ = 0, read = () => __proto__;;) {
        __proto__ = () => __proto__;
        console.log(__proto__.name, __proto__() === __proto__, Object, read());
        break;
    }
}
check("local");
