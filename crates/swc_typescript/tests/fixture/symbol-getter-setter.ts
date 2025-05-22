// @isolatedDeclarations: true
// @emitDeclarationOnly: true

let x = "";

export const foo = {
    get [Symbol.toStringTag]() {
        return x;
    },
    set [Symbol.toStringTag](value: string) {
        x = value;
    },
};

export class Foo {
    #x = "";
    get [Symbol.toStringTag]() {
        return this.#x;
    }
    set [Symbol.toStringTag](value: string) {
        this.#x = value;
    }
}
