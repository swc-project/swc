const targets = [];

{
    function foo() {
        targets.push(new.target);
    }
    foo();
}

expect(targets[0]).toBeUndefined();

{
    class Foo {
        constructor() {
            targets.push(new.target);
        }
    }

    new Foo();
}

expect(targets[1]).not.toBeUndefined();
