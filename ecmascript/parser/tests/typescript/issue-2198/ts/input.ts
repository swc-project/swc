function imp<T extends string>(x: T): typeof import(T) {
    return x;
}

console.log("123");