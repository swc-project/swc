

function* foo() {
    const obj = {
        a: 1,
        b: yield true,
        c: 2,
    };

    return obj.c;
}

const g = foo();
expect(g.next()).toEqual({
    value: true,
    done: false,
})
expect(g.next()).toEqual({
    done: true,
    value: 2
})