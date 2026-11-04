function foo({ a, ...rest }, foo = rest) {
    console.log(a, rest, foo);
}
foo({ a: 1, b: 2, c: 3 });

function bar(_0, _1) {
    const [{ a, ...rest }, foo = rest] = [_0, _1];
}
bar({ a: 1, b: 2, c: 3 });

function x1(a, b = a, { c, ...d }, ...{ e }) {
    console.log(a, b, c, d, e);
}
x1(1, 2, {});

class Foo {
    hello() {
        const foo = ({ a = this.world(), ...c }, b = a) => {
            console.log(a, b, c);
        }
        foo({});

        function bar({ a, ...c }, b = this.world()) {
            console.log(a, b, c);
        }
        bar.call(this, {});
    }

    world() {
        return "world";
    }
}
new Foo().hello(); 
