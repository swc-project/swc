/* 
  Proxy any reads and writes to this member. We'll store the value at some private symbol
  and read or write to it when the member is accessed.
*/
const d = (proto: any, name) => {
    let self = proto.constructor;
    const key = typeof name === "symbol" ? Symbol() : `__${name}`;

    Object.defineProperty(self.prototype, name, {
        get(): any {
            return (this as { [key: string]: unknown })[key as string];
        },
        set(value: unknown) {
            const oldValue = (this as {} as { [key: string]: unknown })[
                name as string
            ];
            (this as {} as { [key: string]: unknown })[key as string] = value;
        },
        configurable: true,
        enumerable: true,
    });
};

class Test {
    @d
    member = 4;
}

console.log(new Test().member);