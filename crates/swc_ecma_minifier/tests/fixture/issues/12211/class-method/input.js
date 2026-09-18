class C {
    method(value, ...rest) {
        value = "changed";
        return arguments[0];
    }
}

console.log(new C().method("original"));
