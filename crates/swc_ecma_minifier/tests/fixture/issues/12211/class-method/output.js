class C {
    method(value) {
        return arguments[0];
    }
}
console.log(new C().method("original"));
