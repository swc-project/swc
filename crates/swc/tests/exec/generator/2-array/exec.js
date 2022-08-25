

function* foo() {
    const arr = [
        1,
        yield true,
        2,
    ];

    expect(arr[1]).toEqual(1);

    yield 2;

    return arr[2];
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