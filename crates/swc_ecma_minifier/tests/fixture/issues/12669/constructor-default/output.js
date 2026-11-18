function load(value) {
    return value + 1;
}
globalThis.Service = class {
    constructor(callback = load){
        this.callback = callback;
    }
};
const first = new Service(), second = new Service();
console.log(first.callback === second.callback, first.callback(2)), console.log(new Service(null).callback);
