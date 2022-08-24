

function* foo() {
    const obj = {
        a: 1,
        b: yield true,
        c: 2,
    };

    expect(obj.b).toEqual(1);

    yield 2;

    return obj.c;
}

const g = foo();
expect(g.next(0)).toEqual({
    value: true,
    done: false,
})
expect(g.next(1)).toEqual({
    value: 2,
    done: false,
})
expect(g.next()).toEqual({
    done: true,
    value: 2
})