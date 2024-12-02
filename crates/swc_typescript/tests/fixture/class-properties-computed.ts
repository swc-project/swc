export class Test {
    [Symbol.for("nodejs.util.inspect.custom")]() {}
    ["string"]: string;
    ["string2" as string]: string;
    [1 as number]: string;
}
