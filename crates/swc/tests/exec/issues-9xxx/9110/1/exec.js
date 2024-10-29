function* test() {
    while (!False()) {
        // execute this line
        while (!False()) {
            // execute this line
            break;
        }
        // execute this line
        if (False()) {
            // NOT execute this line
            break;
        }

        // execute this line
        yield "correct";
        return;
    }

    // NOT execute this line
    yield "wrong";
    return;
}

function False() {
    return false;
}

const t = test();
expect(t.next()).toEqual({
    value: "correct",
    done: false,
});
expect(t.next()).toEqual({
    value: undefined,
    done: true,
});
