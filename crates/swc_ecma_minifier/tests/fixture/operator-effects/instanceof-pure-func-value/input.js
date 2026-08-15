function callback() {
    foo() instanceof bar();
}

function invalid() {
    foo() instanceof 2;
}

function rhs() {
    bar() instanceof foo();
}

function sequence_value() {
    (bar(), foo()) instanceof baz();
}

function sequence_control() {
    (foo(), bar()) instanceof baz();
}

function annotation() {
    /*#__PURE__*/ qux() instanceof bar();
}

function in_control() {
    foo() in bar();
}

function equality_control() {
    foo() === bar();
}

function ordinary_control() {
    baz() instanceof bar();
}

function new_value() {
    bar() instanceof /*#__PURE__*/ new Foo();
}

function tagged_value() {
    bar() instanceof foo`x`;
}
