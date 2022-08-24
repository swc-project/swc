

function* foo() {
    const arr = [
        1,
        yield true,
        2,
    ];

    return arr[2];
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