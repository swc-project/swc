
function* foo() {
    const val = true ? 1 : yield 0;
    console.log({
        val
    });
}

const v = foo();
console.log(v.next());