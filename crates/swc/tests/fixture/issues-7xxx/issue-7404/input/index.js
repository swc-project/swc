function minusTwo({ set, get }) {
    return {
        set(v) {
            set.call(this, v - 2)
        },
        init(v) {
            return v - 2;
        }
    }
}

function timesFour({ set, get }) {
    return {
        set(v) {
            set.call(this, v * 4)
        },
        init(v) {
            return v * 4;
        }
    }
}

class Foo {
    @minusTwo @timesFour accessor bar = 5;
}

const foo = new Foo();
console.log({ init: foo.bar });

foo.bar = 5;
console.log({ set: foo.bar });