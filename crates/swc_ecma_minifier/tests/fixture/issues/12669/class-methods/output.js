function instanceLoad(value) {
    return value + 1;
}
function staticLoad(value) {
    return value + 2;
}
function privateLoad(value) {
    return value + 3;
}
globalThis.Service = class {
    read(callback = instanceLoad) {
        return callback;
    }
    static read(callback = staticLoad) {
        return callback;
    }
    #read(callback = privateLoad) {
        return callback;
    }
    readPrivate() {
        return this.#read();
    }
};
const first = new Service(), second = new Service();
console.log(first.read() === second.read(), first.read()(1)), console.log(Service.read() === Service.read(), Service.read()(1)), console.log(first.readPrivate() === second.readPrivate(), first.readPrivate()(1));
