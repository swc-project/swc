// Repro from comment in #12114

const assignTo2 = <T, K1 extends keyof T, K2 extends keyof T[K1]>(object: T, key1: K1, key2: K2) =>
    (value: T[K1][K2]) => object[key1][key2] = value;

// Modified repro from #12573

declare function one<T>(handler: (t: T) => void): T

var empty = one(() => {
}); // inferred as {}, expected

type Handlers<T> = { [K in keyof T]: (t: T[K]) => void }

declare function on<T>(handlerHash: Handlers<T>): T

var hashOfEmpty1 = on({
    test: () => {
    }
});  // {}
var hashOfEmpty2 = on({
    test: (x: boolean) => {
    }
});  // { test: boolean }

