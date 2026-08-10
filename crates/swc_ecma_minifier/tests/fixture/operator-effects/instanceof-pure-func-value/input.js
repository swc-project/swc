function callback() {
    foo() instanceof bar();
}

function invalid() {
    foo() instanceof 2;
}

function control() {
    foo() === bar();
}
