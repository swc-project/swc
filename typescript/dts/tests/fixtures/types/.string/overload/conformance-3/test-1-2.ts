// @declaration: true

interface Base {
    x: string;
    y: number;
}

interface HelloOrWorld extends Base {
    p1: boolean;
}

interface JustHello extends Base {
    p2: boolean;
}

interface JustWorld extends Base {
    p3: boolean;
}

let hello: "hello";
let world: "world";
let helloOrWorld: "hello" | "world";

function g(p: string): Base;
function g(p: "hello"): JustHello;
function g(p: "hello" | "world"): HelloOrWorld;
function g(p: "world"): JustWorld;
function g(...args: any[]): any {
    return undefined;
}

let gResult1 = g(hello);
let gResult2 = g(world);
let gResult3 = g(helloOrWorld);