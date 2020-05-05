type Box<T> = {
};

type Boxified<T> = {
    [P in keyof T]: Box<T[P]>;
};

function boxify<T>(obj: T): Boxified<T> {
    if (typeof obj === "object") {
        let result = {} as Boxified<T>;
        for (let k in obj) {
            result[k] = { value: obj[k] };
        }
        return result;
    }
    return <any>obj;
}

type A = { a: string };
type B = { b: string };
type C = { c: string };

function f1(x: A | B | C | undefined) {
    return boxify(x);
}