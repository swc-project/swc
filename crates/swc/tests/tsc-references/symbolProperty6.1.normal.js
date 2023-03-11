//// [symbolProperty6.ts]
class C {
    [Symbol.toPrimitive]() {}
    get [Symbol.toStringTag]() {
        return 0;
    }
    constructor(){
        this[Symbol.iterator] = 0;
    }
}
