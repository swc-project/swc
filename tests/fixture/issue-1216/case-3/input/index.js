
function* foo() {
    const val = true ? 1 : yield 0;
    console.log({
        val
    });
}

foo()