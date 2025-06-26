const a = "a";

export const foo = {
    get x() {
        return a;
    },
    // inferred type by annotating the setter parameter
    set x(value: string) {
        console.log(value);
    },
    set y(value) {
        console.log(value);
    },
    // inferred type by annotating the getter return type
    get y(): string {
        return a;
    },
    set z(value) {
        console.log(value);
    },
    // inferred type by inferring the getter body
    get z() {
        return "";
    },

    // readonly
    get w() {
        return "";
    },
};

export class Foo {
    get x() {
        return a;
    }
    // inferred type by annotating the setter parameter
    set x(value: string) {
        console.log(value);
    }
    set y(value) {
        console.log(value);
    }
    // inferred type by annotating the getter return type
    get y(): string {
        return a;
    }
    set z(value) {
        console.log(value);
    }
    // inferred type by inferring the getter body
    get z() {
        return "";
    }

    // readonly
    get w() {
        return "";
    }
}
