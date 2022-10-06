function foo() {
    let walker = 0;

    let arr = [];

    function bar(defaultValue) {
        const myIndex = walker;
        walker += 1;

        console.log({ arr });

        if (arr.length < myIndex + 1) {
            arr[myIndex] = defaultValue;
        }
    }

    return bar;
}

const bar = foo();

bar(null);
bar(null);
bar(null);
bar(null);
bar(null);