// Modified repro from #12544

function path<T, K1 extends keyof T>(obj: T, key1: K1): T[K1];
function path<T, K1 extends keyof T, K2 extends keyof T[K1]>(obj: T, key1: K1, key2: K2): T[K1][K2];
function path<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(obj: T, key1: K1, key2: K2, key3: K3): T[K1][K2][K3];
function path(obj: any, ...keys: (string | number)[]): any;
function path(obj: any, ...keys: (string | number)[]): any {
    let result = obj;
    for (let k of keys) {
        result = result[k];
    }
    return result;
}

type Thing = {
    a: { x: number, y: string },
    b: boolean
};


function f1(thing: Thing) {
    let x1 = path(thing, 'a');  // { x: number, y: string }
    let x2 = path(thing, 'a', 'y');  // string
    let x3 = path(thing, 'b');  // boolean
    let x4 = path(thing, ...['a', 'x']);  // any
}

