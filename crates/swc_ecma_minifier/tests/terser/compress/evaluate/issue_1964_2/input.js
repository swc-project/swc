function f() {
    var long_variable_name = /\s/;
    console.log(long_variable_name.source);
    return "a b c".split(long_variable_name)[1];
}
console.log(f());
