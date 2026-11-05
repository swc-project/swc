function load(value) {
    return value + 1;
}
globalThis.service = {
    read: (callback = load)=>callback
};
const read = service.read;
console.log(service.read() === read(), read()(2));
