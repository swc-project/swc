function field() {
    for (let i = 0, C = class { value = eval("i") }; i < 1;) {
        i = 42;
        console.log(new C().value);
        break;
    }
}
field();
