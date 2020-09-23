// @strictNullChecks: true
// @declaration: true

class Shape {
    name: string;
    width: number;
    height: number;
    visible: boolean;
}

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let len = getProperty(t, "length");
let s2 = getProperty(t, "0");  // Shape
let b2 = getProperty(t, "1");  // boolean
