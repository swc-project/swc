function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function f13(foo: any, bar: any) {
    let x = getProperty(foo, "x");  // any
    let y = getProperty(foo, "100");  // any
    let z = getProperty(foo, bar);  // any
}

