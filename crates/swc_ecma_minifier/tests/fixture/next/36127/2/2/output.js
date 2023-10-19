function regexCheck(regex) {
    return check;
    function check(code) {
        return null !== code && regex.test(String.fromCharCode(code));
    }
}
console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo")), console.log(regexCheck("Foo"));
