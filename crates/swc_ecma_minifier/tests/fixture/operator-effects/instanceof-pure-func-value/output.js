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
    bar(), foo() instanceof baz();
}
function sequence_control() {
    bar(), baz();
}
function annotation() {
    /*#__PURE__*/ qux() instanceof bar();
}
function in_control() {
    bar();
}
function equality_control() {
    bar();
}
function ordinary_control() {
    baz(), bar();
}
