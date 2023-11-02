function regexCheck(regex) {
    return function(code) {
        return null !== code && regex.test(String.fromCharCode(code));
    };
}
console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo"));
