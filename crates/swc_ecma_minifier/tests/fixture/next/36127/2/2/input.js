/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => code is number}
 */
function regexCheck(regex) {
    return check;

    /**
     * Check whether a code matches the bound regex.
     *
     * @param {Code} code Character code
     * @returns {code is number} Whether the character code matches the bound regex
     */
    function check(code) {
        return code !== null && regex.test(String.fromCharCode(code));
    }
}

console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
console.log(regexCheck("Foo"));
